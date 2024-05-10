import { Link, useParams, type LinkProps } from "@remix-run/react";

export type AppLinkProps = LinkProps & {
  org?: string | null;
};
export const AppLink = ({ children, to, org, ...rest }: AppLinkProps) => {
  const params = useParams();
  let orgSlug = org || params.org;
  if (!orgSlug) {
    throw new Error("This component require an organization slug to be found");
  }
  if (typeof to === "string") {
    to = `/app/${orgSlug}${to.startsWith("/") ? "" : "/"}${to}`;
  } else {
    to.pathname = `/app/${orgSlug}${to.pathname?.startsWith("/") ? "" : "/"}${to.pathname}`;
  }

  return (
    <Link {...rest} to={to}>
      {children}
    </Link>
  );
};
