"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";

import {
  modelReducer,
  initialModelState,
  ModelState,
} from "@/reducers/modelReducer";

import {
  mockModels,
  mockModelParameters,
  mockSchedules,
} from "@/mock/modelVersionsData";
import { Model, ModelVersion } from "@/types/model";
import { groupSchedulesByKey } from "@/lib/utils/schedule.helper";

const ModelContext = createContext<
  (ModelState & { fetchModelVersions: (modelId: string) => void }) | undefined
>(undefined);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(modelReducer, initialModelState);

  // 初次載入模型清單 + 最新版本
  useEffect(() => {
    const modelList: Model[] = mockModels.map((m) => {
      if (m.modelVersion && m.modelVersion.length > 0) {
        const latestVersion: ModelVersion =
          m.modelVersion[m.modelVersion.length - 1];
        const key = `${m.modelId}_${latestVersion.version}`;

        const groupedSchedules = groupSchedulesByKey(mockSchedules);

        dispatch({
          type: "SET_LATESTVERSION",
          modelId: m.modelId,
          version: latestVersion,
        });
        dispatch({
          type: "SET_PARAMETERS",
          key: key,
          parameters: mockModelParameters[key],
        });
        if (groupedSchedules) {
          dispatch({
            type: "SET_SCHEDULES",
            payload: groupedSchedules,
          });
        }
      }

      return {
        modelId: m.modelId,
        name: m.name,
        description: m.description,
        language: m.language,
      };
    });

    dispatch({ type: "SET_MODELS", payload: modelList });
  }, []);

  // 模擬 fetch 所有版本資料
  const fetchModelVersions = useCallback((modelId: string) => {
    // if (state.versionMap[modelId]) return; // 已載入過
    dispatch({ type: "SET_LOADING", modelId, loading: true });
    setTimeout(() => {
      const match = mockModels.find((m) => m.modelId === modelId);
      dispatch({
        type: "SET_VERSIONS",
        modelId,
        versions: match?.modelVersion || [],
      });
    }, 800);
  }, []);

  return (
    <ModelContext.Provider value={{ ...state, fetchModelVersions }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModelStore() {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error("useModelStore 必須在 <ModelProvider> 中使用");
  return ctx;
}
