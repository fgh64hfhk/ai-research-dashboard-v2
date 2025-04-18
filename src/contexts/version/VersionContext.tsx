// contexts/version/VersionContext.tsx
"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

import {
  VersionState,
  initialVersionState,
  VersionAction,
  versionReducer,
} from "@/reducers/version.reducer";

import { fetchMockModelVersions } from "@/lib/api/model/model.api";
import { wait } from "@/lib/utils/async.helper";

// ---------------------------
// Context 建立與 Hook
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
// Provider
// ---------------------------

export function VersionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(versionReducer, initialVersionState);

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
