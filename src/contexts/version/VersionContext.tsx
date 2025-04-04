// contexts/version/VersionContext.tsx
"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { ModelVersion } from "@/types/model";
import { fetchMockModelVersions } from "@/lib/api/model";
import { wait } from "@/lib/utils/wait";

// ---------------------------
// 1. State 與 Reducer 定義
// ---------------------------

interface VersionState {
  versionMap: Record<string, ModelVersion[]>; // key = modelId
  loadingMap: Record<string, boolean>;
}

const initialState: VersionState = {
  versionMap: {},
  loadingMap: {},
};

type VersionAction =
  | { type: "SET_VERSIONS"; modelId: string; versions: ModelVersion[] }
  | { type: "SET_LOADING"; modelId: string; loading: boolean };

function versionReducer(
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
    default:
      return state;
  }
}

// ---------------------------
// 2. Context 建立與 Hook
// ---------------------------

const VersionContext = createContext<{
  state: VersionState;
  dispatch: React.Dispatch<VersionAction>;
} | null>(null);

export function useVersionContext() {
  const ctx = useContext(VersionContext);
  if (!ctx)
    throw new Error("useVersionContext 必須在 <VersionProvider> 中使用");
  return ctx;
}

// ---------------------------
// 3. Provider
// ---------------------------

export function VersionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(versionReducer, initialState);

  // 初始載入：模擬載入所有版本資料
  useEffect(() => {
    const load = async () => {
      const [mockData] = await Promise.all([
        fetchMockModelVersions(),
        wait(500),
      ]);

      Object.entries(mockData).forEach(([modelId, versions]) => {
        dispatch({ type: "SET_LOADING", modelId, loading: true });
        dispatch({ type: "SET_VERSIONS", modelId, versions });
        dispatch({ type: "SET_LOADING", modelId, loading: false });
      });
    };
    load();
  }, []);

  return (
    <VersionContext.Provider value={{ state, dispatch }}>
      {children}
    </VersionContext.Provider>
  );
}
