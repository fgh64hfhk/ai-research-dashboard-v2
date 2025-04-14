import { ModelStatus } from "@/types/model";

// ✅ 模型狀態文字顯示
export function getModelStatusText(status: ModelStatus): string {
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

// ✅ 模型狀態對應 badge 樣式
export function getModelStatusBadge(
  status: ModelStatus
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
