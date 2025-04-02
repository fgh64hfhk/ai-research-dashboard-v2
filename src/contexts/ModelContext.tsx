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
import {
  getNextScheduledTask,
  groupSchedulesByKey,
} from "@/lib/utils/schedule.helper";
import { flattenMockModelsVersions } from "@/lib/utils/flatten.helper";

import { reloadLatestVersion as reloadLatestVersionAction } from "@/lib/actions/reloadLatestVersion";

const ModelContext = createContext<
  | (ModelState & {
      fetchModelVersions: (modelId: string) => void;
      reloadLatestVersion: (modelId: string) => void;
    })
  | undefined
>(undefined);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(modelReducer, initialModelState);

  // ✅ 將 mockModels 扁平化
  const versionMap = flattenMockModelsVersions(mockModels);

  // 初次載入模型清單 + 最新版本
  useEffect(() => {
    const groupedSchedules = groupSchedulesByKey(mockSchedules);
    const modelList: Model[] = mockModels.map((m) => {
      const versions = m.modelVersion;

      if (versions && versions.length > 0) {
        const latestVersion: ModelVersion = versions[versions.length - 1];
        const key = `${m.modelId}_${latestVersion.version}`;
        const parameters = mockModelParameters[key];
        const schedules = groupedSchedules[key] || [];

        // 找出最近未來的排程作為摘要
        const nextSchedule = getNextScheduledTask(schedules);

        // ✅ dispatch 最新版本 info
        dispatch({
          type: "SET_LATESTVERSION",
          modelId: m.modelId,
          payload: {
            version: latestVersion,
            parameters,
            nextSchedule,
          },
        });

        // ✅ dispatch 參數（詳細用）
        dispatch({
          type: "SET_PARAMETERS",
          key: key,
          parameters,
        });

        // ✅ dispatch 排程（詳細用）
        dispatch({
          type: "SET_SCHEDULES",
          payload: groupedSchedules,
        });
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

  // ✅ reloadLatestVersion 整合 action 函式
  const reloadLatestVersion = useCallback(
    (modelId: string) => reloadLatestVersionAction(modelId, dispatch),
    [dispatch]
  );

  // ✅ 使用扁平化 versionMap 快速取得版本資料
  const fetchModelVersions = useCallback(
    (modelId: string) => {
      dispatch({ type: "SET_LOADING", modelId, loading: true });

      setTimeout(() => {
        dispatch({
          type: "SET_VERSIONS",
          modelId,
          versions: versionMap[modelId],
        });
      }, 800);
    },
    [versionMap]
  );

  return (
    <ModelContext.Provider
      value={{ ...state, fetchModelVersions, reloadLatestVersion }}
    >
      {children}
    </ModelContext.Provider>
  );
}

export function useModelStore() {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error("useModelStore 必須在 <ModelProvider> 中使用");
  return ctx;
}
