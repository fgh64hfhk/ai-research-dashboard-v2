// components/debug/DebugTriggerResultButton.tsx

"use client";

import { Button } from "@/components/ui/button";
import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { useScheduleById } from "@/hooks/schedule/schedule.hooks";
import { generateMockTrainingResult } from "@/lib/mock/result.mock";
import { toast } from "sonner";

interface Props {
  scheduleId: string;
}

export function DebugTriggerResultButton({ scheduleId }: Props) {
  const { dispatch } = useScheduleContext();
  const schedule = useScheduleById(scheduleId);

  if (!schedule) return null;

  function handleTrigger() {
    const result = generateMockTrainingResult({
      scheduleId,
      modelId: schedule?.modelId || "",
      version: schedule?.version || "",
    });

    dispatch({ type: "SET_RESULT", payload: result });
    toast.success(
      `模擬訓練完成：${result.status === "completed" ? "成功" : "失敗"}`
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleTrigger}>
      模擬訓練完成
    </Button>
  );
}
