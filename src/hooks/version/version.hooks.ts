// contexts/version/version.hooks.ts
import { useVersionContext } from "@/contexts/version/VersionContext";
import { VersionAction } from "@/reducers/version.reducer";
import { ModelVersion } from "@/types/model";

import { fetchMockModelVersions } from "@/lib/api/model/model.api";
import { wait } from "@/lib/utils/async.helper";
import { useParameterByVersionKey } from "@/hooks/parameter/parameter.hooks";
import { useSchedulesByVersionKey } from "@/hooks/schedule/schedule.hooks";
import { useIncompleteParams } from "@/hooks/parameter/useIncompleteParams";
import { useEffect, useRef } from "react";

// ✅ 取得指定模型的所有版本清單
export function useVersionsByModelId(modelId: string): ModelVersion[] {
  const {
    state: { versionMap },
  } = useVersionContext();
  return versionMap[modelId] ?? [];
}

// ✅ 取得指定模型的版本載入狀態
export function useVersionLoading(modelId: string): boolean {
  const {
    state: { loadingMap },
  } = useVersionContext();
  return loadingMap[modelId] ?? false;
}

// ✅ 取得最新版本（預設為版本號最大的那筆）
export function useLatestVersionByModelId(
  modelId: string
): ModelVersion | undefined {
  const versions = useVersionsByModelId(modelId);
  if (versions.length === 0) return undefined;
  return [...versions].sort((a, b) => b.version.localeCompare(a.version))[0];
}

// ✅ 觸發版本清單載入（用於懶加載）
export async function fetchModelVersions(
  modelId: string,
  dispatch: React.Dispatch<VersionAction>
) {
  dispatch({ type: "SET_LOADING", modelId, loading: true });

  const [mockData] = await Promise.all([fetchMockModelVersions(), wait(500)]);

  const versions = mockData[modelId] ?? [];

  dispatch({ type: "SET_VERSIONS", modelId, versions });
  dispatch({ type: "SET_LOADING", modelId, loading: false });
}

export function useAddVersion() {
  const { dispatch } = useVersionContext();

  return (modelId: string, version: ModelVersion) => {
    dispatch({
      type: "ADD_VERSION",
      modelId,
      version,
    });
  };
}

/**
 * 檢查指定版本是否已完成（參數與排程都存在），並更新 localStorage 狀態。
 */
export function useCheckVersionComplete(modelId: string, versionId: string) {
  const key = `${modelId}_${versionId}`;
  const parameters = useParameterByVersionKey(modelId, versionId);
  const schedules = useSchedulesByVersionKey(modelId, versionId);
  const { clearIncomplete, markIncomplete } = useIncompleteParams();

  const isParamMissing = !parameters || Object.keys(parameters).length === 0;
  const isScheduleMissing = !schedules || schedules.length === 0;

  const isComplete = !isParamMissing && !isScheduleMissing;

  // ✅ 用來追蹤上一次的同步狀態，避免無限更新
  const prevStatusRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevStatusRef.current === isComplete) return; // 若狀態未改變，跳過
    prevStatusRef.current = isComplete;

    if (isComplete) {
      clearIncomplete(key);
    } else {
      markIncomplete(key);
    }
  }, [isComplete, key, clearIncomplete, markIncomplete]);

  return { isComplete, isParamMissing, isScheduleMissing };
}
