// app/schedule/[id]/page.tsx
"use client";

import { useParams, notFound } from "next/navigation";

import { useModelList } from "@/hooks/model/model.hooks";
import { useVersionsByModelId } from "@/hooks/version/version.hooks";
import { useScheduleById } from "@/hooks/schedule/schedule.hooks";

import { ScheduleStatusBadge } from "@/components/schedule/ScheduleStatusBadge";
import { typeLabels } from "@/components/schedule/TrainingScheduleView";

import {
  ArrowLeft,
  Info,
  CalendarClock,
  Cpu,
  Package,
  Clock,
  CalendarDays,
  Database,
  Repeat,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

import { InfoRowGroup } from "@/components/schedule/InfoRowGroup";
import { InfoRow } from "@/components/schedule/InfoRow";

export default function ScheduleDetailPage() {
  const { id } = useParams<{ id: string }>();

  const models = useModelList();
  const schedule = useScheduleById(id);
  const versions = useVersionsByModelId(schedule?.modelId || "");

  if (!schedule) return notFound();

  const model = models.find((m) => m.modelId === schedule.modelId);
  const modelName = model?.name ?? schedule.modelId;

  const versionInfo = versions.find((v) => v.version === schedule.version);

  const type = schedule.type ? typeLabels[schedule.type] : null;

  return (
    <div className="container max-w-2xl py-10 space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/models">
          <Button variant="ghost" size="sm" className="px-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> 返回模型列表
          </Button>
        </Link>
      </div>

      <Card>
        <CardTitle className="px-4">
          <h1 className="text-xl font-bold px-2">排程詳情</h1>
        </CardTitle>
        <CardContent className="space-y-4 p-6">
          <InfoRowGroup columns={2}>
            <InfoRow
              label="模型名稱"
              value={modelName}
              icon={<Cpu size={16} />}
              tooltip="模型識別名稱"
            />
            <InfoRow
              label="建構版本"
              value={schedule.version}
              icon={<Package size={16} />}
              tooltip={`${versionInfo?.version}_模型版本代碼`}
            />
            <InfoRow
              label="建構日期"
              value={format(new Date(schedule.buildDate), "yyyy-MM-dd")}
              icon={<Clock size={16} />}
            />
            <InfoRow
              label="執行時間"
              value={format(new Date(schedule.runDate), "yyyy-MM-dd HH:mm")}
              icon={<CalendarClock size={16} />}
            />
            <InfoRow
              label="任務狀態"
              value={<ScheduleStatusBadge status={schedule.status} />}
              icon={<Info size={16} />}
            />
            {schedule.createdAt && (
              <InfoRow
                label="建立時間"
                value={format(
                  new Date(schedule.createdAt),
                  "yyyy-MM-dd HH:mm:ss"
                )}
                icon={<CalendarDays size={16} />}
              />
            )}
            <InfoRow
              label="訓練資料集"
              value="large-dataset-openfin-ai-2024-v3"
              icon={<Database size={16} />}
              tooltip="資料集來自 2024 年金融開放資料整理"
            />
            {type && (
              <InfoRow
                label="排程類型"
                value={type.label}
                icon={<Repeat size={16} />}
                tooltip="任務觸發類型，例如手動或週期性執行"
              />
            )}
          </InfoRowGroup>
        </CardContent>
      </Card>
    </div>
  );
}
