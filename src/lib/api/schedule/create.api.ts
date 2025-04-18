import { wait } from "@/lib/utils/async.helper";
import { SchedulePayload, ScheduleResponse } from "@/types/schedule";

export async function createSchedule(
  payload: SchedulePayload
): Promise<ScheduleResponse> {
  console.log("[Mock API] 創建新排程:", payload);

  await wait(500);

  if (Math.random() < 0.2) {
    throw new Error("[Mock API] 模擬伺服器錯誤，請稍後再試");
  }

  return {
    scheduleId: payload.scheduleId,
    modelId: payload.modelId,
    version: payload.version,
    status: payload.status || "scheduled",
    message: "Schedule created successfully",
  };
}
