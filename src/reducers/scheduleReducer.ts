import { TrainingSchedule } from "@/types/schedule";

// Reducer 狀態型別
export interface ScheduleState {
  schedules: TrainingSchedule[];
}

// Action 類型定義
export type ScheduleAction =
  | { type: "ADD_SCHEDULE"; payload: TrainingSchedule }
  | {
      type: "UPDATE_SCHEDULE";
      payload: TrainingSchedule;
    }
  | { type: "REMOVE_SCHEDULE"; payload: { id: string } };

// 實作 reducer function
export const scheduleReducer = (
  state: ScheduleState,
  action: ScheduleAction
): ScheduleState => {
  switch (action.type) {
    case "ADD_SCHEDULE":
      return {
        ...state,
        schedules: [...state.schedules, action.payload],
      };
    case "UPDATE_SCHEDULE":
      return {
        ...state,
        schedules: state.schedules.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case "REMOVE_SCHEDULE":
      return {
        ...state,
        schedules: state.schedules.filter((s) => s.id !== action.payload.id),
      };

    default:
      return state;
  }
};

// 預設的初始狀態與匯出
// export const initialScheduleState: ScheduleState = {
//   schedules: [],
// };

// 直接預載一些假資料（僅供開發測試使用）
export const initialScheduleState: ScheduleState = {
  schedules: [
    {
      id: "dummy-1",
      modelId: "model-A",
      version: "v1.0",
      buildDate: "2025-03-20",
      runDate: "2025-03-25T14:00:00Z",
      status: "scheduled",
      createdAt: new Date().toISOString(),
    },
    {
      id: "dummy-2",
      modelId: "model-B",
      version: "v2.0",
      buildDate: "2025-03-21",
      runDate: "2025-03-26T15:30:00Z",
      status: "failed",
      createdAt: new Date().toISOString(),
    },
    {
      id: "dummy-3",
      modelId: "model-C",
      version: "v1.2",
      buildDate: "2025-03-22",
      runDate: "2025-03-27T10:00:00Z",
      status: "completed",
      createdAt: new Date().toISOString(),
    },
  ],
};
