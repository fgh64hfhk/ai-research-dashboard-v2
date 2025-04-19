"use client";

import { Card } from "@/components/ui/card";
import { ScheduleStatusBadge } from "../schedule/ScheduleStatusBadge";
import { CalendarClock, Clock, Layers, List } from "lucide-react";
import { ScheduleStatus } from "@/types/schedule";

interface ScheduleInfoCardProps {
  scheduleId: string;
  modelId: string;
  version: string;
  runDate: string;
  buildDate: string;
  type: string;
  status: ScheduleStatus;
}

export function ScheduleInfoCard({
  scheduleId,
  modelId,
  version,
  runDate,
  buildDate,
  type,
  status,
}: ScheduleInfoCardProps) {
  return (
    <Card className="p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          排程任務 #{scheduleId}
        </h2>
        <ScheduleStatusBadge status={status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mt-2">
        <InfoItem icon={<Layers className="w-4 h-4" />} label="模型/版本">
          {modelId} / {version}
        </InfoItem>
        <InfoItem icon={<CalendarClock className="w-4 h-4" />} label="排程時間">
          {new Date(runDate).toLocaleString()}
        </InfoItem>
        <InfoItem icon={<Clock className="w-4 h-4" />} label="建立時間">
          {new Date(buildDate).toLocaleString()}
        </InfoItem>
        <InfoItem icon={<List className="w-4 h-4" />} label="排程類型">
          {type.toUpperCase()}
        </InfoItem>
      </div>
    </Card>
  );
}

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="pt-1 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-0.5">
          {label}
        </p>
        <p className="text-foreground break-all leading-snug">{children}</p>
      </div>
    </div>
  );
}
