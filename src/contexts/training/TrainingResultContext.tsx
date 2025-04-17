"use client";

import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useEffect,
} from "react";

import {
  TrainingResultState,
  trainingResultReducer,
  TrainingResultAction,
  initialTrainingResultState,
} from "@/reducers/trainingResult.reducer";
import { fetchMockTrainingResults } from "@/lib/api/training/fetch";
import { wait } from "@/lib/utils/async.helper";

const TrainingResultContext = createContext<{
  state: TrainingResultState;
  dispatch: React.Dispatch<TrainingResultAction>;
} | null>(null);

export function TrainingResultProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    trainingResultReducer,
    initialTrainingResultState
  );

  // 初始載入：模擬載入所有排程資料
  useEffect(() => {
    const load = async () => {
      const [mockData] = await Promise.all([
        fetchMockTrainingResults(),
        wait(500),
      ]);

      dispatch({
        type: "SET_RESULTS",
        payload: mockData,
      });
    };
    load();
  }, []);

  return (
    <TrainingResultContext.Provider value={{ state, dispatch }}>
      {children}
    </TrainingResultContext.Provider>
  );
}

export function useTrainingResultContext() {
  const context = useContext(TrainingResultContext);
  if (!context) {
    throw new Error(
      "useTrainingResultContext 必須在 <TrainingResultProvider> 中使用"
    );
  }
  return context;
}
