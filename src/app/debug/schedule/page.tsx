"use client";

import { useEffect } from "react";

import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { DebugTriggerResultButton } from "@/components/debug/DebugTriggerResultButton";
import { TrainingResultCard } from "@/components/debug/TrainingResultCard";
import { TrainingProgressCard } from "@/components/schedule/TrainingProgressCard";

import { useTrainingSocket } from "@/hooks/socket/useTrainingSocket";
import { startMockTrainingSocket } from "@/mock/socketMock";

export default function DebugSchedulePage() {
  const {
    state: { scheduleMap, resultMap },
  } = useScheduleContext();

  const allSchedules = Object.values(scheduleMap).flat();
  const runningSchedule = allSchedules.find((s) => s.status === "running");

  // 組件掛載階段（Componet Mounted）時模擬 WebSocket 連線
  useEffect(() => {
    if (runningSchedule?.id) {
      startMockTrainingSocket(runningSchedule.id);
    }
  }, [runningSchedule?.id]);

  const { progress, connected, isCompleted } = useTrainingSocket(runningSchedule?.id);

  const schedulesWithResult = allSchedules.map((s) => ({
    schedule: s,
    result: resultMap[s.id], // 使用 scheduleId 取 result
  }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">訓練排程測試區</h2>
      {schedulesWithResult.map(({ schedule, result }) => {
        const isRunning = schedule.id === runningSchedule?.id;

        return (
          <div key={schedule.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {schedule.modelId} - {schedule.version}
                </p>
                <p className="text-xs font-muted-foreground">
                  排程 ID：{schedule.id}
                </p>
              </div>
              <DebugTriggerResultButton scheduleId={schedule.id} />
            </div>
            {/* 判斷該排程是否為目前進行中的，渲染對應進度卡 */}
            {isRunning && !isCompleted ? (
              <TrainingProgressCard progress={progress} connected={connected} />
            ) : (
              <TrainingResultCard result={result} />
            )}
          </div>
        );
      })}
    </div>
  );
}
