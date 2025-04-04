// contexts/parameter/ParameterContext.tsx
"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { ModelParameters } from "@/types/parameters";
import { wait } from "@/lib/utils/wait";
import { fetchMockParameters } from "@/lib/api/parameter";

// ---------------------------
// 1. State 與 Reducer 定義
// ---------------------------

interface ParameterState {
  parameterMap: Record<string, ModelParameters>; // key = modelId_version
}

const initialState: ParameterState = {
  parameterMap: {},
};

type ParameterAction = {
  type: "SET_PARAMETERS";
  key: string;
  parameters: ModelParameters;
};

function parameterReducer(
  state: ParameterState,
  action: ParameterAction
): ParameterState {
  switch (action.type) {
    case "SET_PARAMETERS":
      return {
        ...state,
        parameterMap: {
          ...state.parameterMap,
          [action.key]: action.parameters,
        },
      };
    default:
      return state;
  }
}

// ---------------------------
// 2. Context 建立與 Hook
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
// 3. Provider
// ---------------------------

export function ParameterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(parameterReducer, initialState);

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
