import { Badge } from "@/components/ui/badge";
import {
  getStatusLabel,
  getStatusBadgeVariant,
} from "@/lib/utils/status.helper";

export function ScheduleStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
}
