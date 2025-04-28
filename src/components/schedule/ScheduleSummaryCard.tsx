"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { InfoRow } from "@/components/common/InfoRow";
import { InfoRowGroup } from "@/components/common/InfoRowGroup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { TrainingSchedule } from "@/types/schedule";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, Hash, Loader2 } from "lucide-react";

export default function ScheduleSummaryCard({
  schedule,
}: {
  schedule: TrainingSchedule;
}) {
  const router = useRouter();

  const handleDetail = () => {
    router.push(`/schedules/${schedule.scheduleId}`);
  };

  return (
    <Card className="border shadow-sm" id="schedule_view">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          排程摘要
          {schedule.status === "running" && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> 訓練中
            </Badge>
          )}
          {schedule.status === "completed" && (
            <Badge variant="default">已完成</Badge>
          )}
          {schedule.status === "scheduled" && (
            <Badge variant="secondary">待執行</Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <InfoRowGroup columns={2}>
          <InfoRow
            label="排程 ID"
            value={schedule.scheduleId}
            icon={<Hash className="h-4 w-4" />}
            tooltip="系統自動生成的排程識別碼"
          />
          <InfoRow
            label="建立時間"
            value={new Date(schedule.buildDate).toLocaleString()}
            icon={<CalendarDays className="h-4 w-4" />}
          />
          <InfoRow
            label="預定執行時間"
            value={new Date(schedule.runDate).toLocaleString()}
            icon={<CalendarDays className="h-4 w-4" />}
          />
          <InfoRow
            label="排程狀態"
            value={schedule.status}
            icon={<Clock className="h-4 w-4" />}
          />
        </InfoRowGroup>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button size="sm" onClick={handleDetail}>
          查看詳細頁
        </Button>
      </CardFooter>
    </Card>
  );
}
