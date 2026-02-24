import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  throw redirect(`/app${url.search}`);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  throw redirect(`/app${url.search}`);
};
