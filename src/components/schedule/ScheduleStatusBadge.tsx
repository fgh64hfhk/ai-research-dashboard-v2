import { Badge } from "@/components/ui/badge";
import {
  getScheduleStatusLabel,
  getScheduleStatusBadgeVariant,
} from "@/lib/utils/scheduleStatus.helper";
import { ScheduleStatus } from "@/types/schedule";

interface Props {
  status?: ScheduleStatus;
}

export function ScheduleStatusBadge({ status }: Props) {
  const label = getScheduleStatusLabel(status || "scheduled");
  const variant = getScheduleStatusBadgeVariant(status || "scheduled");
  return <Badge variant={variant}>{label}</Badge>;
}
