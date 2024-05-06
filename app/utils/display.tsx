export const initials = (name: string) => {
  const initials = name.split(" ").map((word) => word[0]);
  return initials.length === 1 && initials[0]
    ? initials[0].toUpperCase()
    : `${initials[0]?.toUpperCase() ?? ""}${
        initials[initials.length - 1]?.toUpperCase() ?? ""
      }`;
};
