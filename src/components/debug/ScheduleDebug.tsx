"use client";

import { useSchedulesByVersionKey } from "@/hooks/schedule/schedule.hooks";
import { getScheduleKey } from "@/hooks/schedule/schedule.hooks";

interface Props {
  modelId: string;
  version: string;
}

export function ScheduleDebug({ modelId, version }: Props) {
  const schedules = useSchedulesByVersionKey(modelId, version);
  const key = getScheduleKey(modelId, version);

  if (!schedules || schedules.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">無排程資料：{key}</div>
    );
  }

  return (
    <>
      <h3 className="font-semibold mb-2">排程 JSON（{key}）</h3>
      <pre>{JSON.stringify(schedules, null, 2)}</pre>
    </>
  );
}
