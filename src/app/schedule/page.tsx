"use client";

import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";

import { Skeleton } from "@/components/ui/skeleton";
import { ScheduleCard } from "@/components/schedule/ScheduleCard";
import { useState } from "react";

export default function TaskListPage() {
  const {
    state: { scheduleMap },
  } = useScheduleContext();

  const [loading] = useState(false);
  const [error] = useState(false);

  const allSchedules = Object.values(scheduleMap).flat();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">排程任務清單</h1>

      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-500 font-medium">
          ⚠️ 載入任務時發生錯誤：{error}
        </p>
      )}

      {!loading && !error && allSchedules.length === 0 && (
        <p className="text-muted-foreground">目前沒有任何的排程任務。</p>
      )}

      <div className="space-y-4">
        {allSchedules.map((schedule) => (
          <ScheduleCard key={schedule.id} schedule={schedule} />
        ))}
      </div>
    </div>
  );
}
