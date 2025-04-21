import React from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Layers3 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";

interface ScheduleHeaderProps {
  modelName: string;
  version: string;
  status: string;
  scheduledAt: string;
}

const statusColorMap: Record<string, string> = {
  scheduled: "bg-yellow-500 text-white",
  running: "bg-blue-500 text-white",
  success: "bg-green-500 text-white",
  failed: "bg-red-500 text-white",
};

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  modelName,
  version,
  status,
  scheduledAt,
}) => {
  return (
    <Card className="p-6 space-y-3">
      <CardTitle>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Layers3 className="w-5 h-5" />
          模型 {modelName}（{version}）
        </h2>
      </CardTitle>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <CalendarDays className="w-4 h-4" />
          預定訓練時間：{scheduledAt}
        </div>
        <Badge className={statusColorMap[status] || "bg-gray-400 text-white"}>
          狀態：{status}
        </Badge>
      </div>
    </Card>
  );
};

export default ScheduleHeader;
