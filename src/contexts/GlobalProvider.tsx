"use client";

import { ReactNode } from "react";
import { ModelProvider } from "@/contexts/model/ModelContext";
import { VersionProvider } from "./version/VersionContext";
import { ParameterProvider } from "./parameter/ParameterContext";
import { ScheduleProvider } from "./schedule/ScheduleContext";

import { Toaster } from "@/components/ui/sonner";

export function GlobalProvider({ children }: { children: ReactNode }) {
  return (
    <ModelProvider>
      <VersionProvider>
        <ParameterProvider>
          <ScheduleProvider>
            {children}
            <Toaster richColors />
          </ScheduleProvider>
        </ParameterProvider>
      </VersionProvider>
    </ModelProvider>
  );
}
