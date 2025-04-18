// contexts/model/ModelContext.tsx

"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

import {
  modelReducer,
  initialModelState,
  ModelState,
  ModelAction,
} from "@/reducers/model.reducer";

import { fetchMockModels } from "@/lib/api/model/model.api";
import { wait } from "@/lib/utils/async.helper";

// ---------------------------
// Context 建立與 Hook 提供
// ---------------------------

const ModelContext = createContext<{
  state: ModelState;
  dispatch: React.Dispatch<ModelAction>;
} | null>(null);

export function useModelContext() {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error("useModelContext 必須在 <ModelProvider> 中使用");
  return ctx;
}

// ---------------------------
// Provider 元件
// ---------------------------

export function ModelProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(modelReducer, initialModelState);

  useEffect(() => {
    const fetchModels = async () => {
      dispatch({ type: "SET_LOADING", modelId: "all", loading: true });
      const [mockData] = await Promise.all([fetchMockModels(), wait(500)]);

      dispatch({ type: "SET_MODELS", payload: mockData });
      dispatch({ type: "SET_LOADING", modelId: "all", loading: false });
    };
    fetchModels();
  }, []);

  return (
    <ModelContext.Provider value={{ state, dispatch }}>
      {children}
    </ModelContext.Provider>
  );
}
