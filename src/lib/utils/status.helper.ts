export const getStatusLabel = (status: string) => {
  switch (status) {
    case "scheduled":
      return "已排程";
    case "running":
      return "執行中";
    case "completed":
      return "已完成";
    case "failed":
      return "失敗";

    default:
      return status;
  }
};

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "scheduled":
      return "secondary";
    case "running":
      return "default";
    case "completed":
      return "outline";
    case "failed":
      return "destructive";
    default:
      return "default";
  }
};
