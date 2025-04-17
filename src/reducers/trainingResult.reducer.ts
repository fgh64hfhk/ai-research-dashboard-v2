// reducers/trainingResult.reducer.ts

import { TrainingResult } from "@/types/schedule";

// ----------
// State
// ----------

export interface TrainingResultState {
  resultMap: Record<string, TrainingResult[]>; // key = scheduleId
}

export const initialTrainingResultState: TrainingResultState = {
  resultMap: {},
};

// ----------
// Actions
// ----------

export type TrainingResultAction =
  | { type: "SET_RESULTS"; payload: Record<string, TrainingResult[]> }
  | { type: "CLEAR_RESULT"; scheduleId: string };

// ----------
// Reducer
// ----------

export function trainingResultReducer(
  state: TrainingResultState,
  action: TrainingResultAction
): TrainingResultState {
  switch (action.type) {
    case "SET_RESULTS":
      return {
        ...state,
        resultMap: {
          ...state.resultMap,
          ...action.payload,
        },
      };

    case "CLEAR_RESULT": {
      const newMap = { ...state.resultMap };
      delete newMap[action.scheduleId];
      return {
        ...state,
        resultMap: newMap,
      };
    }
    default:
      return state;
  }
}
