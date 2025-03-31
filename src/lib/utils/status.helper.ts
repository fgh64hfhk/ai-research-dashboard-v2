export function getModelStatusLabel(status: string): string {
  switch (status) {
    case "Training":
      return "訓練中";
    case "Deployed":
      return "已部署";
    case "Deployment Failed":
      return "部署失敗";
    case "Scheduled":
      return "已排程";
    case "Pending Deployment":
      return "等待部署";
    case "Inactive":
      return "未啟用";
    case "Deployment Canceled":
      return "已取消部署";
    default:
      return status;
  }
}

export function getModelStatusBadgeVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Deployed":
      return "default";
    case "Training":
    case "Scheduled":
      return "secondary";
    case "Deployment Failed":
    case "Deployment Canceled":
      return "destructive";
    case "Inactive":
      return "outline";
    default:
      return "outline";
  }
}

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
