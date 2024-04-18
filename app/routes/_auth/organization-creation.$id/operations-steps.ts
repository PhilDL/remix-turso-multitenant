export type OperationStatus = "pending" | "in-progress" | "success" | "error";
export type OperationSteps =
  | "organization-creation"
  | "database-creation"
  | "preparing-environment";

export const parseOperationStatus = (data: string) => {
  const [key, status] = data.split(":");
  return { key, status } as {
    key: OperationSteps;
    status: OperationStatus;
  };
};
