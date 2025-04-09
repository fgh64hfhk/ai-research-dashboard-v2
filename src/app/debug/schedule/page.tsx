"use client";

import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { DebugTriggerResultButton } from "@/components/debug/DebugTriggerResultButton";
import { TrainingResultCard } from "@/components/debug/TrainingResultCard";

export default function DebugSchedulePage() {
  const {
    state: { scheduleMap, resultMap },
  } = useScheduleContext();
  const allSchedules = Object.values(scheduleMap).flat();

  const schedulesWithResult = allSchedules.map((s) => ({
    schedule: s,
    result: resultMap[s.id], // 使用 scheduleId 取 result
  }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">訓練排程測試區</h2>
      {schedulesWithResult.map(({ schedule, result }) => (
        <div key={schedule.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {schedule.modelId} - {schedule.version}
              </p>
              <p className="text-xs font-muted-foreground">排程 ID：{schedule.id}</p>
            </div>
            <DebugTriggerResultButton scheduleId={schedule.id} />
          </div>
          <TrainingResultCard result={result} />
        </div>
      ))}
    </div>
  );
}
