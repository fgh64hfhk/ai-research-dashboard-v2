import { mockSchedules } from "@/mock/modelVersionsData";
import { TrainingSchedule } from "@/types/schedule";

export async function fetchMockSchedules(): Promise<
  Record<string, TrainingSchedule[]>
> {
  return groupSchedulesByKey(mockSchedules);
}

import { SchedulePayload } from "@/types/schedule";
import { ScheduleResponse } from "@/types/schedule";
import { groupSchedulesByKey } from "../utils/schedule.helper";

// const API_BASE = "";

// 模擬延遲
const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

// 建立新的 schedule 任務
export async function createSchedule(
  payload: SchedulePayload
): Promise<ScheduleResponse> {
  console.log("[Mock API] createSchedule payload:", payload);

  // 模擬延遲 500ms
  await wait(500);

  if (Math.random() < 0.2) {
    throw new Error("[Mock API] 模擬伺服器錯誤，請稍後再試");
  }

  // 模擬後端回傳格式
  const mockResponse: ScheduleResponse = {
    id: "schedule_" + Math.floor(Math.random() * 10000),
    status: "scheduled",
    message: "Schedule created successfully",
    createdAt: new Date().toISOString(),
  };

  return mockResponse;

  //   const res = await fetch(API_BASE, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(payload),
  //   });

  //   if (!res.ok) {
  //     const error = await res.json();
  //     throw new Error(error?.message || "Failed to create schedule");
  //   }

  //   const data: ScheduleResponse = await res.json();
  //   return data;
}
