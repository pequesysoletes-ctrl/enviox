/**
 * Shopify Fulfillment Service
 * Creates fulfillments and adds tracking info to Shopify orders
 */

const MRW_TRACKING_URL = "https://www.mrw.es/seguimiento_envios/";

interface FulfillmentResult {
  success: boolean;
  fulfillmentId?: string;
  error?: string;
}

/**
 * Create a fulfillment for an order in Shopify with MRW tracking info.
 * This marks the order as "fulfilled" in Shopify and adds the tracking number.
 */
export async function createShopifyFulfillment(
  admin: any,
  shopifyOrderId: string,
  trackingNumber: string,
  trackingCompany: string = "MRW",
): Promise<FulfillmentResult> {
  try {
    // Step 1: Get the fulfillment order(s) for this order
    const orderGid = shopifyOrderId.startsWith("gid://")
      ? shopifyOrderId
      : `gid://shopify/Order/${shopifyOrderId}`;

    const fulfillmentOrdersResponse = await admin.graphql(
      `#graphql
        query getFulfillmentOrders($orderId: ID!) {
          order(id: $orderId) {
            fulfillmentOrders(first: 5) {
              nodes {
                id
                status
                lineItems(first: 50) {
                  nodes {
                    id
                    remainingQuantity
                  }
                }
              }
            }
          }
        }
      `,
      { variables: { orderId: orderGid } },
    );

    const fulfillmentOrdersData = await fulfillmentOrdersResponse.json();
    const fulfillmentOrders =
      fulfillmentOrdersData?.data?.order?.fulfillmentOrders?.nodes || [];

    // Filter to only open/in-progress fulfillment orders
    const openFulfillmentOrders = fulfillmentOrders.filter(
      (fo: any) => fo.status === "OPEN" || fo.status === "IN_PROGRESS",
    );

    if (openFulfillmentOrders.length === 0) {
      return {
        success: false,
        error: "No hay items pendientes de fulfillment en este pedido",
      };
    }

    // Step 2: Create the fulfillment with tracking info
    const fulfillmentOrderLineItems = openFulfillmentOrders.map((fo: any) => ({
      fulfillmentOrderId: fo.id,
      fulfillmentOrderLineItems: fo.lineItems.nodes
        .filter((li: any) => li.remainingQuantity > 0)
        .map((li: any) => ({
          id: li.id,
          quantity: li.remainingQuantity,
        })),
    }));

    const fulfillmentResponse = await admin.graphql(
      `#graphql
        mutation fulfillmentCreateV2($fulfillment: FulfillmentV2Input!) {
          fulfillmentCreateV2(fulfillment: $fulfillment) {
            fulfillment {
              id
              status
              trackingInfo {
                number
                url
                company
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        variables: {
          fulfillment: {
            lineItemsByFulfillmentOrder: fulfillmentOrderLineItems,
            trackingInfo: {
              number: trackingNumber,
              url: `${MRW_TRACKING_URL}${trackingNumber}`,
              company: trackingCompany,
            },
            notifyCustomer: true,
          },
        },
      },
    );

    const fulfillmentData = await fulfillmentResponse.json();
    const result = fulfillmentData?.data?.fulfillmentCreateV2;

    if (result?.userErrors?.length > 0) {
      const errorMsg = result.userErrors
        .map((e: any) => e.message)
        .join(", ");
      console.error("[Fulfillment] Shopify errors:", errorMsg);
      return { success: false, error: errorMsg };
    }

    const fulfillmentId = result?.fulfillment?.id;
    console.log(
      `[Fulfillment] ✅ Created fulfillment ${fulfillmentId} with tracking ${trackingNumber}`,
    );

    return {
      success: true,
      fulfillmentId: fulfillmentId,
    };
  } catch (error: any) {
    console.error("[Fulfillment] Error creating fulfillment:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Update tracking info on an existing fulfillment
 */
export async function updateShopifyTracking(
  admin: any,
  fulfillmentId: string,
  trackingNumber: string,
  trackingCompany: string = "MRW",
): Promise<FulfillmentResult> {
  try {
    const fulfillmentGid = fulfillmentId.startsWith("gid://")
      ? fulfillmentId
      : `gid://shopify/Fulfillment/${fulfillmentId}`;

    const response = await admin.graphql(
      `#graphql
        mutation fulfillmentTrackingInfoUpdateV2(
          $fulfillmentId: ID!
          $trackingInfoInput: FulfillmentTrackingInput!
        ) {
          fulfillmentTrackingInfoUpdateV2(
            fulfillmentId: $fulfillmentId
            trackingInfoInput: $trackingInfoInput
          ) {
            fulfillment {
              id
              trackingInfo {
                number
                url
                company
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        variables: {
          fulfillmentId: fulfillmentGid,
          trackingInfoInput: {
            number: trackingNumber,
            url: `${MRW_TRACKING_URL}${trackingNumber}`,
            company: trackingCompany,
          },
        },
      },
    );

    const data = await response.json();
    const result = data?.data?.fulfillmentTrackingInfoUpdateV2;

    if (result?.userErrors?.length > 0) {
      const errorMsg = result.userErrors
        .map((e: any) => e.message)
        .join(", ");
      return { success: false, error: errorMsg };
    }

    return { success: true, fulfillmentId };
  } catch (error: any) {
    console.error("[Fulfillment] Error updating tracking:", error.message);
    return { success: false, error: error.message };
  }
}
