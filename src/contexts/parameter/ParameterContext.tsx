// contexts/parameter/ParameterContext.tsx
"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

import {
  ParameterState,
  initialParameterState,
  ParameterAction,
  parameterReducer,
} from "@/reducers/parameter.reducer";

import { wait } from "@/lib/utils/async.helper";
import { fetchMockParameters } from "@/lib/api/parameter/parameter.api";

// ---------------------------
// Context 建立與 Hook
// ---------------------------

const ParameterContext = createContext<{
  state: ParameterState;
  dispatch: React.Dispatch<ParameterAction>;
} | null>(null);

export function useParameterContext() {
  const ctx = useContext(ParameterContext);
  if (!ctx)
    throw new Error("useParameterContext 必須在 <ParameterProvider> 中使用");
  return ctx;
}

// ---------------------------
// Provider
// ---------------------------

export function ParameterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(parameterReducer, initialParameterState);

  // 初始載入：模擬載入所有版本資料
  useEffect(() => {
    const load = async () => {
      const [mockData] = await Promise.all([fetchMockParameters(), wait(500)]);
      Object.entries(mockData).forEach(([key, parameters]) => {
        dispatch({
          type: "SET_PARAMETERS",
          key: key,
          parameters: parameters,
        });
      });
    };
    load();
  }, []);

  return (
    <ParameterContext.Provider value={{ state, dispatch }}>
      {children}
    </ParameterContext.Provider>
  );
}
