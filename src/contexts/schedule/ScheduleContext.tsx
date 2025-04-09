// contexts/schedule/ScheduleContext.tsx
"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { TrainingSchedule } from "@/types/schedule";
import { fetchMockSchedules } from "@/lib/api/schedule";
import { wait } from "@/lib/utils/wait";

// ---------------------------
// 1. State 與 Reducer 定義
// ---------------------------

interface ScheduleState {
  scheduleMap: Record<string, TrainingSchedule[]>; // key = modelId_version
}

const initialState: ScheduleState = {
  scheduleMap: {},
};

type ScheduleAction =
  | {
      type: "SET_SCHEDULES";
      payload: Record<string, TrainingSchedule[]>;
    }
  | {
      type: "ADD_SCHEDULE";
      payload: TrainingSchedule;
    };

function scheduleReducer(
  state: ScheduleState,
  action: ScheduleAction
): ScheduleState {
  switch (action.type) {
    case "SET_SCHEDULES":
      return {
        ...state,
        scheduleMap: {
          ...state.scheduleMap,
          ...action.payload, // 可合併多組 key
        },
      };
    case "ADD_SCHEDULE": {
      const schedule = action.payload;
      const key = `${schedule.modelId}_${schedule.version}`;
      const existing = state.scheduleMap[key] ?? [];
      return {
        ...state,
        scheduleMap: {
          ...state.scheduleMap,
          [key]: [schedule, ...existing],
        },
      };
    }
    default:
      return state;
  }
}

// ---------------------------
// 2. Context 建立與 Hook
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
// 3. Provider
// ---------------------------

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);

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
