// components/model/VersionInfoCard.tsx
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock, PencilLine, Hash, Timer } from "lucide-react";

import { ModelVersion } from "@/types/model";
import { ModelVersionStatusBadge } from "@/components/models/ModelVersionStatusBadge";

export function VersionInfoCard({
  version,
  modifiedDate,
  modifiedType,
  trainingTime,
  buildDate,
  status,
}: ModelVersion) {
  return (
    <Card>
      <CardContent className="py-4 space-y-4">
        <h2 className="text-xl font-medium border-b pb-2 flex justify-between">
          版本資訊
          <ModelVersionStatusBadge status={status} />
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <InfoItem
            icon={<Hash className="w-4 h-4" />}
            label="版本號"
            value={version}
          />
          <InfoItem
            icon={<CalendarClock className="w-4 h-4" />}
            label="建立時間"
            value={format(new Date(buildDate), "yyyy-MM-dd HH:mm")}
          />
          <InfoItem
            icon={<PencilLine className="w-4 h-4" />}
            label="修改時間"
            value={format(new Date(modifiedDate), "yyyy-MM-dd HH:mm")}
          />
          <InfoItem
            icon={<PencilLine className="w-4 h-4" />}
            label="修改摘要"
            value={modifiedType}
          />
          <InfoItem
            icon={<Timer className="w-4 h-4" />}
            label="訓練時間"
            value={`${trainingTime}s`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="pt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs font-medium">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
