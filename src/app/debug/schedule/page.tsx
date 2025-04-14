"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { DebugTriggerResultButton } from "@/components/debug/DebugTriggerResultButton";
import { TrainingResultCard } from "@/components/debug/TrainingResultCard";
import { TrainingProgressCard } from "@/components/schedule/TrainingProgressCard";

import { useTrainingSocket } from "@/hooks/socket/useTrainingSocket";
import { startMockTrainingSocket } from "@/mock/socketMock";
import { DebugStartTrainingButton } from "@/components/debug/DebugStartTrainingButton";
import { generateMockTrainingResult } from "@/lib/mock/result.mock";
import { useScheduleById } from "@/hooks/schedule/schedule.hooks";

import { toast } from "sonner";

import { Button } from '@/components/ui/button'

export default function DebugSchedulePage() {
  const {
    state: { scheduleMap, resultMap },
    dispatch,
  } = useScheduleContext();
  const router = useRouter();

  const allSchedules = Object.values(scheduleMap).flat();
  const [runningScheduleId, setRunningScheduleId] = useState<string | null>(
    null
  );

  const schedule = useScheduleById(runningScheduleId || "");
  const modelId = schedule?.modelId ?? "";
  const version = schedule?.version ?? "";

  // 在 dispatch 改變狀態後，同步設定 runningScheduleId
  // 追蹤目前的 running schedule id
  useEffect(() => {
    const running = allSchedules.find((s) => s.status === "running");
    if (running?.id !== runningScheduleId) {
      setRunningScheduleId(running?.id || null);
    }
  }, [allSchedules, runningScheduleId]);

  // 組件掛載階段（Componet Mounted）時模擬 WebSocket 連線 --> 專門監聽 ID 的變化
  // 建立模擬的 socket server 的通道
  useEffect(() => {
    if (runningScheduleId) {
      startMockTrainingSocket(runningScheduleId);
    }
  }, [runningScheduleId]);

  // 根據 running schedule id 啟動客戶端的 socket 請求
  const { progress, connected, isCompleted, setIsCompleted } =
    useTrainingSocket(runningScheduleId || "");

  // 當 progress 完成，寫入結果與狀態
  useEffect(() => {
    if (isCompleted && runningScheduleId) {
      const result = generateMockTrainingResult({
        scheduleId: runningScheduleId,
        modelId: modelId,
        version: version,
      });
      dispatch({
        type: "SET_SCHEDULE_STATUS",
        id: runningScheduleId,
        status: "completed",
      });
      dispatch({
        type: "SET_RESULT",
        payload: result,
      });
      toast.success(
        `模擬訓練完成：${result.status === "completed" ? "成功" : "失敗"}`
      );
      setIsCompleted(false);
    }
  }, [
    isCompleted,
    runningScheduleId,
    dispatch,
    setIsCompleted,
    modelId,
    version,
  ]);

  const schedulesWithResult = allSchedules.map((s) => ({
    schedule: s,
    result: resultMap[s.id], // 使用 scheduleId 取 result
  }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">訓練排程測試區</h2>
      <Button onClick={() => router.push(`/models/m001/compare`)} >查看</Button>
      {schedulesWithResult.map(({ schedule, result }) => {
        const isRunning = schedule.id === runningScheduleId;
        const isScheduled = schedule.status === "scheduled";

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
              <div className="flex gap-2">
                {isScheduled && (
                  <DebugStartTrainingButton scheduleId={schedule.id} />
                )}
                <DebugTriggerResultButton scheduleId={schedule.id} />
              </div>
            </div>

            {/* 判斷該排程是否為目前進行中的，渲染對應進度卡 */}
            {isRunning && !isCompleted ? (
              <TrainingProgressCard progress={progress} connected={connected} />
            ) : result ? (
              <TrainingResultCard result={result} />
            ) : (
              <p className="text-xs text-muted-foreground">尚無訓練結果</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
