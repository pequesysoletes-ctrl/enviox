import type { LoaderFunctionArgs } from "@remix-run/node";
import { login } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const errors = login(request);
  return { errors };
};

export default function Auth() {
  return null;
}
