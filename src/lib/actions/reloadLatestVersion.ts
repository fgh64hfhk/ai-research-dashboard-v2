import { fetchLatestVersion, fetchParameters, fetchSchedules } from "@/lib/api";

import { LatestVersionInfo, ModelAction } from "@/reducers/modelReducer";

import {
  getNextScheduledTask,
  groupSchedulesByKey,
} from "@/lib/utils/schedule.helper";

export async function reloadLatestVersion(
  modelId: string,
  dispatch: React.Dispatch<ModelAction>
) {
  dispatch({ type: "SET_LATESTVERSION_LOADING", modelId, loading: true });

  try {
    const version = await fetchLatestVersion(modelId);
    const key = `${modelId}_${version.version}`;
    const parameters = await fetchParameters(key);
    const allSchedules = await fetchSchedules();
    const grouped = groupSchedulesByKey(allSchedules);
    const schedules = grouped[key] || [];

    const nextSchedule = getNextScheduledTask(schedules);

    const payload: LatestVersionInfo = {
      version,
      parameters,
      nextSchedule,
    };

    dispatch({ type: "SET_LATESTVERSION", modelId, payload });
    dispatch({ type: "SET_PARAMETERS", key, parameters });
    dispatch({ type: "SET_SCHEDULES", payload: grouped });
  } catch (error) {
    console.error("載入最新版本失敗：", error);
  } finally {
    dispatch({ type: "SET_LATESTVERSION_LOADING", modelId, loading: false });
  }
}
