import { Badge } from "@/components/ui/badge";
import {
  getModelStatusText,
  getModelStatusBadge,
} from "@/lib/utils/modelStatus.helper";
import { ModelStatus } from "@/types/model";

interface Props {
  status?: ModelStatus;
}

export function ModelVersionStatusBadge({ status }: Props) {
  const label = getModelStatusText(status || ModelStatus.INACTIVE);
  const variant = getModelStatusBadge(status || ModelStatus.INACTIVE);
  return <Badge variant={variant}>{label}</Badge>;
}
