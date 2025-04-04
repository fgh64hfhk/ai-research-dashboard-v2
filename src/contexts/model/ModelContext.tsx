"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { Model } from "@/types/model";

import { fetchMockModels } from "@/lib/api/model";
import { wait } from "@/lib/utils/wait";

// ---------------------------
// 1. 定義 State 形狀與 Action
// ---------------------------

interface ModelState {
  models: Model[];
  loadingMap: Record<string, boolean>; // key: modelId
}

const initialState: ModelState = {
  models: [],
  loadingMap: {},
};

// ---------------------------
// 2. Action 類型
// ---------------------------

type ModelAction =
  | { type: "SET_MODELS"; payload: Model[] }
  | { type: "SET_LOADING"; modelId: string; loading: boolean };

function modelReducer(state: ModelState, action: ModelAction): ModelState {
  switch (action.type) {
    case "SET_MODELS":
      return { ...state, models: action.payload };
    case "SET_LOADING":
      return {
        ...state,
        loadingMap: { ...state.loadingMap, [action.modelId]: action.loading },
      };
    default:
      return state;
  }
}

// ---------------------------
// 3. Context 建立與 Hook 提供
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
// 4. Provider 元件
// ---------------------------

export function ModelProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(modelReducer, initialState);

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
