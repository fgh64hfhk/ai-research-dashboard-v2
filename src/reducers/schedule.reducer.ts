// reducers/schedule.reducer.ts

import { ScheduleStatus, TrainingSchedule } from "@/types/schedule";

// ---------------------------
// 1. State 定義
// ---------------------------

export interface ScheduleState {
  scheduleMap: Record<string, TrainingSchedule[]>;
}

export const initialScheduleState: ScheduleState = {
  scheduleMap: {},
};

// ---------------------------
// 2. Action 定義
// ---------------------------

export type ScheduleAction =
  | { type: "SET_SCHEDULES"; payload: Record<string, TrainingSchedule[]> }
  | { type: "ADD_SCHEDULE"; payload: TrainingSchedule }
  | { type: "SET_SCHEDULE_STATUS"; id: string; status: ScheduleStatus };

// ---------------------------
// 3. Reducer 主體
// ---------------------------

export function scheduleReducer(
  state: ScheduleState,
  action: ScheduleAction
): ScheduleState {
  switch (action.type) {
    case "SET_SCHEDULES":
      return {
        ...state,
        scheduleMap: {
          ...state.scheduleMap,
          ...action.payload,
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
    case "SET_SCHEDULE_STATUS": {
      const updateMap = { ...state.scheduleMap };
      for (const key in updateMap) {
        updateMap[key] = updateMap[key].map((s) =>
          s.id === action.id ? { ...s, status: action.status } : s
        );
      }
      return {
        ...state,
        scheduleMap: updateMap,
      };
    }
    default:
      return state;
  }
}
