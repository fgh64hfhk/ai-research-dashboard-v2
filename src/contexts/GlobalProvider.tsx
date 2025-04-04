"use client";

import { ReactNode } from "react";
import { ModelProvider } from "@/contexts/model/ModelContext";
import { ScheduleProvider } from "./ScheduleContext";

import { Toaster } from "@/components/ui/sonner";

export function GlobalProvider({ children }: { children: ReactNode }) {
  return (
    <ModelProvider>
      <ScheduleProvider>
        {/* 將來可以在這裡加入更多 provider */}
        {children}
        <Toaster richColors />
      </ScheduleProvider>
    </ModelProvider>
  );
}
