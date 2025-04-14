import { SchedulePayload, ScheduleResponse } from "@/types/schedule";

// 模擬延遲
const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function createSchedule(
  payload: SchedulePayload
): Promise<ScheduleResponse> {
  console.log("[Mock API] createSchedule payload:", payload);

  await wait(500);

  if (Math.random() < 0.2) {
    throw new Error("[Mock API] 模擬伺服器錯誤，請稍後再試");
  }

  return {
    scheduleId: "schedule_" + Math.floor(Math.random() * 10000),
    modelId: payload.modelId,
    version: payload.version,
    status: "scheduled",
    message: "Schedule created successfully",
    completedAt: new Date().toISOString(),
  };
}
