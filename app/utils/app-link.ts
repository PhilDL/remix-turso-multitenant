export const appLink = (to: string, org: { slug: string }) => {
  return `/space/${org.slug}${to.startsWith("/") ? "" : "/"}${to}`;
};
