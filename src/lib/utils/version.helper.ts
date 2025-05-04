// lib/utils/version.helper.ts
import { VersionActivateFormValues } from "@/schemas/versionActivateSchema";
import { ModelModifiedType, ModelVersion } from "@/types/model";
import { TrainingInsight } from "./insight.helper";

export function getSortedVersions(
  versions: ModelVersion[],
  isDescending: boolean
): (ModelVersion & { isLatest: boolean })[] {
  const sorted = [...versions].sort((a, b) =>
    isDescending
      ? new Date(b.buildDate).getTime() - new Date(a.buildDate).getTime()
      : new Date(a.buildDate).getTime() - new Date(b.buildDate).getTime()
  );

  const latestVersionId = isDescending
    ? sorted[0]?.version
    : sorted[sorted.length - 1]?.version;

  return sorted.map((v) => ({
    ...v,
    isLatest: v.version === latestVersionId,
  }));
}

/**
 * 根據當前版本與更新類型回傳下一版號
 * @param current 當前版本號，如 "v1.0"
 * @param type 更新類型：major（大版本）或 minor（小版本）
 * @returns 下一個版本號字串
 */
export function getNextVersionString(
  current: string,
  type: "major" | "minor" = "minor"
): string {
  if (!current.startsWith("v")) throw new Error("版本號必須以 'v' 開頭");

  const [majorStr, minorStr] = current.replace("v", "").split(".");
  const major = parseInt(majorStr, 10);
  const minor = parseInt(minorStr, 10);

  if (isNaN(major) || isNaN(minor)) {
    throw new Error("版本號格式錯誤，應為 'vX.Y' 形式");
  }

  return type === "major" ? `v${major + 1}.0` : `v${major}.${minor + 1}`;
}

export function compareVersionString(a: string, b: string): number {
  const parse = (v: string) => v.replace(/^v/i, "").split(".").map(Number);
  const [aMajor, aMinor = 0] = parse(a);
  const [bMajor, bMinor = 0] = parse(b);

  if (aMajor !== bMajor) return aMajor - bMajor;
  return aMinor - bMinor;
}

export type GeneratePreFilledVersionOptions =
  | {
      mode: "initialActivation";
      modelId: string;
      baseVersion: string;
    }
  | {
      mode: "postComparison";
      modelId: string;
      baseVersion: string;
      insightSummary: TrainingInsight;
      modifiedType: ModelModifiedType;
    };

export function generatePreFilledVersion(
  options: GeneratePreFilledVersionOptions
): VersionActivateFormValues {
  const nextVersion = getNextVersionString(options.baseVersion, "minor");

  if (options.mode === "initialActivation") {
    return {
      modelId: options.modelId,
      version: nextVersion,
      modifiedType: ModelModifiedType.ACTIVATE_COMPARE,
      description: "此版本用於激活模型版本比較功能。",
    };
  }

  if (options.mode === "postComparison") {
    const { insightSummary, modifiedType } = options;

    if (!insightSummary || insightSummary.accImprove === undefined || insightSummary.lossImprove === undefined) {
      throw new Error("generatePreFilledVersion: 無效或不完整的 summary 資料");
    }

    // 動態生成建議描述
    const recommendedDescription = generateRecommendedDescription(
      modifiedType,
      insightSummary
    );

    return {
      modelId: options.modelId,
      version: nextVersion,
      modifiedType: modifiedType,
      description: recommendedDescription,
    };
  }

  throw new Error("Invalid generatePreFilledVersion options");
}

function generateRecommendedDescription(
  modifiedType: ModelModifiedType,
  insightSummary: TrainingInsight
) {
  switch (modifiedType) {
    case "參數調整":
      return `基於指標分析（Accuracy ${insightSummary.accImprove?.toFixed(1)}% 提升），進行參數調整優化。`;
    case "資料集擴增":
      return `基於訓練損失未達預期（Loss ${insightSummary.lossImprove?.toFixed(1)}% 改善），建議擴增資料集。`;
    case "模型架構修改":
      return `基於現有模型表現，建議嘗試調整模型架構以提升效能。`;
    default:
      return "根據分析結果，進行優化更新。";
  }
}
