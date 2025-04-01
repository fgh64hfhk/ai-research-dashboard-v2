import { Badge } from "@/components/ui/badge";
import {
  getModelStatusLabel,
  getModelStatusBadgeVariant,
} from "@/lib/utils/status.helper";

export function ModelVersionStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={getModelStatusBadgeVariant(status)}>
      {getModelStatusLabel(status)}
    </Badge>
  );
}
