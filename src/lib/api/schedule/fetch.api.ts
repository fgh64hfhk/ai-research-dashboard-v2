import { mockSchedules } from "@/mock/modelVersionsData";
import { TrainingSchedule } from "@/types/schedule";
import { groupSchedulesByKey } from "@/lib/utils/schedule.helper";

export async function fetchMockSchedules(): Promise<
  Record<string, TrainingSchedule[]>
> {
  return groupSchedulesByKey(mockSchedules);
}
