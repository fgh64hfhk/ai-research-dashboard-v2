"use client";

import { ReactNode } from "react";
import { ScheduleProvider } from "./ScheduleContext";

import { Toaster } from "@/components/ui/sonner";

export function GlobalProvider({ children }: { children: ReactNode }) {
  return (
    <ScheduleProvider>
      {/* 將來可以在這裡加入更多 provider */}
      {children}
      <Toaster richColors />
    </ScheduleProvider>
  );
}
