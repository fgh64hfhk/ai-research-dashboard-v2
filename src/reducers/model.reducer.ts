// reducers/model.reducer.ts

import { Model } from "@/types/model";

// ---------------------------
// State 型別
// ---------------------------
export interface ModelState {
  models: Model[];
  loadingMap: Record<string, boolean>; // key: modelId
}

export const initialModelState: ModelState = {
  models: [],
  loadingMap: {},
};

// ---------------------------
// Action 類型
// ---------------------------
export type ModelAction =
  | { type: "SET_MODELS"; payload: Model[] }
  | { type: "SET_LOADING"; modelId: string; loading: boolean };

// ---------------------------
// Reducer 本體
// ---------------------------
export function modelReducer(
  state: ModelState,
  action: ModelAction
): ModelState {
  switch (action.type) {
    case "SET_MODELS":
      return { ...state, models: action.payload };
    case "SET_LOADING":
      return {
        ...state,
        loadingMap: {
          ...state.loadingMap,
          [action.modelId]: action.loading,
        },
      };
    default:
      return state;
  }
}
