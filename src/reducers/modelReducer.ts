import { Model, ModelVersion } from "@/types/model";

export interface ModelState {
  models: Model[];
  versionMap: Record<string, ModelVersion[]>; // key: modelId
  loadingMap: Record<string, boolean>;
}

export type ModelAction =
  | { type: "SET_MODELS"; payload: Model[] }
  | { type: "SET_VERSIONS"; modelId: string; versions: ModelVersion[] }
  | { type: "SET_LOADING"; modelId: string; loading: boolean };

export function modelReducer(
  state: ModelState,
  action: ModelAction
): ModelState {
  switch (action.type) {
    case "SET_MODELS":
      return { ...state, models: action.payload };
    case "SET_VERSIONS":
      return {
        ...state,
        versionMap: {
          ...state.versionMap,
          [action.modelId]: action.versions,
        },
        loadingMap: { ...state.loadingMap, [action.modelId]: false },
      };
    case "SET_LOADING":
      return {
        ...state,
        loadingMap: { ...state.loadingMap, [action.modelId]: action.loading },
      };
    default:
      return state;
  }
}

export const initialModelState: ModelState = {
  models: [],
  versionMap: {},
  loadingMap: {},
};
