// components/debug/ScheduleDebug.tsx
"use client";

import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { useEffect, useState } from "react";

export function ScheduleDebug() {
  const {
    state: { scheduleMap },
  } = useScheduleContext();

  const [json, setJson] = useState<string>("");

  useEffect(() => {
    setJson(JSON.stringify(scheduleMap, null, 2));
  }, [scheduleMap]);

  return (
    <div className="bg-muted rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2">Schedule Map Debug</h2>
      <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-[500px]">
        {json}
      </pre>
    </div>
  );
}
