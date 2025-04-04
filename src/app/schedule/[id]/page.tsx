"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import { useScheduleContext } from "@/contexts/ScheduleContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ScheduleStatusBadge } from "@/components/schedule/ScheduleStatusBadge";

import { InfoRowGroup } from "@/components/schedule/InfoRowGroup";
import { InfoRow } from "@/components/schedule/InfoRow";

import { Info, CalendarClock, Cpu } from "lucide-react";

export default function ScheduleDetailPage() {
  const { state } = useScheduleContext();
  const router = useRouter();
  const params = useParams();
  const scheduleId = params.id as string;

  const schedule = state.schedules.find((s) => s.id === scheduleId);

  if (!schedule) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">任務詳細資訊</h1>
        <p className="text-destructive">
          找不到該任務，請確認任務 ID 是否正確。
        </p>
        <Button onClick={() => router.back()}>返回清單</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">任務詳細資訊</h1>
        <Button variant="outline" onClick={() => router.push("/schedule")}>
          返回清單
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <InfoRowGroup columns={2}>
            <InfoRow
              label="模型 ID"
              value={schedule.modelId}
              icon={<Cpu size={16} />}
              tooltip="模型唯一識別碼"
            />
            <InfoRow
              label="建構版本"
              value={schedule.version}
              icon={<Info size={16} />}
            />
            <InfoRow label="建構日期" value={schedule.buildDate} />
            <InfoRow
              label="執行時間"
              value={format(new Date(schedule.runDate), "yyyy-MM-dd HH:mm")}
              icon={<CalendarClock size={16} />}
            />
            <InfoRow
              label="任務狀態"
              value={<ScheduleStatusBadge status={schedule.status} />}
            />
            {schedule.createdAt && (
              <InfoRow
                label="建立時間"
                value={format(
                  new Date(schedule.createdAt),
                  "yyyy-MM-dd HH:mm:ss"
                )}
              />
            )}
            <InfoRow
              label="訓練資料集"
              value="large-dataset-openfin-ai-2024-v3"
              tooltip="資料集來自 2024 年金融開放資料整理"
            />
          </InfoRowGroup>
        </CardContent>
      </Card>
    </div>
  );
}
