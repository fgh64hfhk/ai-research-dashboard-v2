// components/compare/VersionSummaryCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ModelVersionStatusBadge } from "../models/ModelVersionStatusBadge";
import { ModelVersion } from "@/types/model";

interface Props {
  version: ModelVersion;
  title: string;
}

export function VersionSummaryCard({ version, title }: Props) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <ModelVersionStatusBadge status={version.status || ""} />
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>
          <span className="text-muted-foreground">構建時間：</span>
          {format(new Date(version.buildDate), "yyyy-MM-dd HH:mm")}
        </p>
        <p>
          <span className="text-muted-foreground">修改類型：</span>
          {version.modifiedType}
        </p>
        <p>
          <span className="text-muted-foreground">訓練時間：</span>
          {version.trainingTime} s
        </p>
      </CardContent>
    </Card>
  );
}
