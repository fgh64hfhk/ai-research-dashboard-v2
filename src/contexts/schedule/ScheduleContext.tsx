// contexts/schedule/ScheduleContext.tsx
"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

import {
  ScheduleState,
  initialScheduleState,
  ScheduleAction,
  scheduleReducer,
} from "@/reducers/schedule.reducer";

import { fetchMockSchedules } from "@/lib/api/schedule/fetch.api";
import { wait } from "@/lib/utils/async.helper";

// ---------------------------
// Context 建立與 Hook
// ---------------------------

const ScheduleContext = createContext<{
  state: ScheduleState;
  dispatch: React.Dispatch<ScheduleAction>;
} | null>(null);

export function useScheduleContext() {
  const ctx = useContext(ScheduleContext);
  if (!ctx)
    throw new Error("useScheduleContext 必須在 <ScheduleProvider> 中使用");
  return ctx;
}

// ---------------------------
// Provider
// ---------------------------

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(scheduleReducer, initialScheduleState);

  // 初始載入：模擬載入所有排程資料
  useEffect(() => {
    const load = async () => {
      const [mockData] = await Promise.all([fetchMockSchedules(), wait(500)]);

      dispatch({
        type: "SET_SCHEDULES",
        payload: mockData,
      });
    };
    load();
  }, []);

  return (
    <ScheduleContext.Provider value={{ state, dispatch }}>
      {children}
    </ScheduleContext.Provider>
  );
}
