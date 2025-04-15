// contexts/version/version.hooks.ts
import { useVersionContext } from "@/contexts/version/VersionContext";
import { VersionAction } from "@/reducers/version.reducer";
import { ModelVersion } from "@/types/model";

import { fetchMockModelVersions } from "@/lib/api/model.api";
import { wait } from "@/lib/utils/async.helper";

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
