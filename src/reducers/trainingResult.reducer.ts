// reducers/trainingResult.reducer.ts

import { TrainingResult } from "@/types/training";

// ----------
// State
// ----------

export interface TrainingResultState {
  resultMap: Record<string, TrainingResult[]>; // key = version_scheduleId
}

export const initialTrainingResultState: TrainingResultState = {
  resultMap: {},
};

// ----------
// Actions
// ----------

export type TrainingResultAction =
  | { type: "SET_RESULTS"; payload: Record<string, TrainingResult[]> }
  | { type: "ADD_RESULT"; key: string; result: TrainingResult }
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

    case "ADD_RESULT": {
      const existing = state.resultMap[action.key] || [];
      return {
        ...state,
        resultMap: {
          ...state.resultMap,
          [action.key]: [...existing, action.result],
        },
      };
    }

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
