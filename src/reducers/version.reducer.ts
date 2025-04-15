// ---------------------------
// reducers/version.reducer.ts
// ---------------------------

import { ModelVersion } from "@/types/model";

export interface VersionState {
  versionMap: Record<string, ModelVersion[]>; // key = modelId
  loadingMap: Record<string, boolean>;
}

export const initialVersionState: VersionState = {
  versionMap: {},
  loadingMap: {},
};

export type VersionAction =
  | { type: "SET_VERSIONS"; modelId: string; versions: ModelVersion[] }
  | { type: "SET_LOADING"; modelId: string; loading: boolean }
  | { type: "ADD_VERSION"; modelId: string; version: ModelVersion };

export function versionReducer(
  state: VersionState,
  action: VersionAction
): VersionState {
  switch (action.type) {
    case "SET_VERSIONS":
      return {
        ...state,
        versionMap: {
          ...state.versionMap,
          [action.modelId]: action.versions,
        },
      };
    case "SET_LOADING":
      return {
        ...state,
        loadingMap: {
          ...state.loadingMap,
          [action.modelId]: action.loading,
        },
      };
    case "ADD_VERSION": {
      const existing = state.versionMap[action.modelId] ?? [];
      return {
        ...state,
        versionMap: {
          ...state.versionMap,
          [action.modelId]: [...existing, action.version],
        },
      };
    }
    default:
      return state;
  }
}
