"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import {
  scheduleReducer,
  initialScheduleState,
  ScheduleState,
  ScheduleAction,
} from "@/reducers/scheduleReducer";

// 定義 Context 類型
interface ScheduleContextType {
  state: ScheduleState;
  dispatch: React.Dispatch<ScheduleAction>;
}

// 建立 Context（初始化為 null）
const ScheduleContext = createContext<ScheduleContextType | null>(null);

// 建立 Provider 組件
export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(scheduleReducer, initialScheduleState);

  return (
    <ScheduleContext.Provider value={{ state, dispatch }}>
      {children}
    </ScheduleContext.Provider>
  );
};

// 建立 Custom Hook
export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error("useScheduleContext 必須在 <ScheduleProvider> 中使用");
  }
  return context;
};
