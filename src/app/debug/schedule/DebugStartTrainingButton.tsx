// components/debug/DebugStartTrainingButton.tsx

"use client";

import { Button } from "@/components/ui/button";
import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { PlayCircle } from "lucide-react";

interface Props {
  scheduleId: string;
}

export function DebugStartTrainingButton({ scheduleId }: Props) {
  const { dispatch } = useScheduleContext();

  const handleStart = () => {
    dispatch({
      type: "SET_SCHEDULE_STATUS",
      id: scheduleId,
      status: "running",
    });
  };

  return (
    <Button variant="default" size="sm" onClick={handleStart}>
      <PlayCircle className="w-4 h-4 mr-2" />
      開始訓練
    </Button>
  );
}
