import { json, type LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return json({});
};

export default function AppIndex() {
  return null;
}
