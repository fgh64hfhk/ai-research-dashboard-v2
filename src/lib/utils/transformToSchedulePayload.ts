// lib/utils/transformToSchedulePayload.ts

import { ScheduleFormData } from "@/types/form";
import { SchedulePayload } from "@/types/schedule";

export function transformToSchedulePayload(form: ScheduleFormData): SchedulePayload {
  return {
    modelId: form.modelId,
    version: form.version,
    runDate: form.runDate.toISOString(),
    type: form.type,
    buildDate: new Date().toISOString(),
    status: "scheduled",
  };
}
