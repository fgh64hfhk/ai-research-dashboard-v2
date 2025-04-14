import { ScheduleStatus } from "@/types/schedule";

export function getScheduleStatusLabel(status: ScheduleStatus): string {
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
}

export function getScheduleStatusBadgeVariant(
  status: ScheduleStatus
): "default" | "secondary" | "destructive" | "outline" {
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
}
