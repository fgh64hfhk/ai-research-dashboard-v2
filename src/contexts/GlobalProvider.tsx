"use client";

import { ReactNode } from "react";
import { ModelProvider } from "@/contexts/model/ModelContext";
import { VersionProvider } from "@/contexts/version/VersionContext";
import { ParameterProvider } from "@/contexts/parameter/ParameterContext";
import { ScheduleProvider } from "@/contexts/schedule/ScheduleContext";
import { TrainingResultProvider } from "@/contexts/trainingResult/TrainingResultContext";

import { Toaster } from "@/components/ui/sonner";

export function GlobalProvider({ children }: { children: ReactNode }) {
  return (
    <ModelProvider>
      <VersionProvider>
        <ParameterProvider>
          <ScheduleProvider>
            <TrainingResultProvider>{children}</TrainingResultProvider>
            <Toaster richColors />
          </ScheduleProvider>
        </ParameterProvider>
      </VersionProvider>
    </ModelProvider>
  );
}
