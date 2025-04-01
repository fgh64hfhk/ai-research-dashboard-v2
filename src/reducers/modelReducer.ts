import { Model, ModelVersion } from "@/types/model";
import { ModelParameters } from "@/types/parameters";
import { TrainingSchedule } from "@/types/schedule";

export interface ModelState {
  models: Model[];
  latestVersion: Record<string, ModelVersion>; // key: modelId
  versionMap: Record<string, ModelVersion[]>; // key: modelId
  parameterMap: Record<string, ModelParameters>; // key: modelId_version
  scheduleMap: Record<string, TrainingSchedule[]>; // key: modelId_version
  loadingMap: Record<string, boolean>;
}

export type ModelAction =
  | { type: "SET_MODELS"; payload: Model[] }
  | { type: "SET_LATESTVERSION"; modelId: string; version: ModelVersion }
  | { type: "SET_VERSIONS"; modelId: string; versions: ModelVersion[] }
  | { type: "SET_PARAMETERS"; key:string; parameters: ModelParameters}
  | { type: "SET_SCHEDULES"; payload: Record<string, TrainingSchedule[]>}
  | { type: "SET_LOADING"; modelId: string; loading: boolean };

export function modelReducer(
  state: ModelState,
  action: ModelAction
): ModelState {
  switch (action.type) {
    case "SET_MODELS":
      return { ...state, models: action.payload };
    case "SET_LATESTVERSION":
      return {
        ...state,
        latestVersion: {
          ...state.latestVersion,
          [action.modelId]: action.version,
        },
      };
    case "SET_VERSIONS":
      return {
        ...state,
        versionMap: {
          ...state.versionMap,
          [action.modelId]: action.versions,
        },
        loadingMap: { ...state.loadingMap, [action.modelId]: false },
      };
    case "SET_PARAMETERS":
      return {
        ...state,
        parameterMap: {
          ...state.parameterMap,
          [action.key]: action.parameters,
        }
      }
    case "SET_SCHEDULES":
      return {
        ...state,
        scheduleMap: action.payload
      }
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
  latestVersion: {},
  versionMap: {},
  parameterMap: {},
  scheduleMap: {},
  loadingMap: {},
};
