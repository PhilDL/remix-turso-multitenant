export const appLink = (to: string, org: { slug: string }) => {
  return `/app/${org.slug}${to.startsWith("/") ? "" : "/"}${to}`;
};
