import { ModelParameters } from "@/types/parameters";
import { TrainingInsight } from "./insight.helper";

const VERSION_PREFILL_KEY = "version_prefill_data";

export interface VersionPrefillData {
  fromComparePage: boolean;
  modelId: string;
  version: string;
  prefillParams?: ModelParameters;
  insightSummary?: TrainingInsight;
  createdAt: number;
}

/**
 * 儲存版本導引資料到 localStorage
 */
export function saveVersionPrefillData(data: VersionPrefillData) {
  localStorage.setItem(VERSION_PREFILL_KEY, JSON.stringify(data));
}

/**
 * 讀取並驗證版本導引資料
 * @returns 成功則返回資料，失敗則返回 null
 */
export function loadVersionPrefillData(
  modelId: string,
  versionId: string,
  expireMinutes = 10
): VersionPrefillData | null {
  const raw = localStorage.getItem(VERSION_PREFILL_KEY);
  if (!raw) return null;

  try {
    const data: VersionPrefillData = JSON.parse(raw);

    // 檢查 modelId, versionId, 過期時間
    const isValidModel = data.modelId === modelId;
    const isValidVersion = data.version === versionId;
    const isNotExpired =
      Date.now() - data.createdAt < expireMinutes * 60 * 1000;

    if (isValidModel && isValidVersion && isNotExpired) {
      return data;
    }
  } catch (error) {
    console.error("解析 prefill data 失敗", error);
  }

  return null;
}

/**
 * 清除版本導引資料
 */
export function clearVersionPrefillData() {
  localStorage.removeItem(VERSION_PREFILL_KEY);
}
