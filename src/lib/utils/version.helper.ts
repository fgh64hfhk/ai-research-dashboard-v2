// lib/utils/version.helper.ts
import { ModelModifiedType, ModelStatus, ModelVersion } from "@/types/model";
import { TrainingInsight } from "./insight.helper";
import dayjs from "dayjs";

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

export function generatePreFilledVersion(
  targetVersion: ModelVersion,
  insight?: TrainingInsight
): ModelVersion {
  const now = dayjs().format("YYYY-MM-DD HH:mm");
  const nextVersion = getNextVersionString(targetVersion.version, "minor");

  const importantLabel = insight?.insights?.find(
    (item) => item.important
  )?.label;

  const descriptionLines = [
    importantLabel ? `⭐ 重點指標：${importantLabel}` : null,
    insight?.recommendation ? `📌 建議：${insight.recommendation}` : null,
  ].filter(Boolean);

  return {
    modelId: targetVersion.modelId,
    version: nextVersion,
    modifiedDate: now,
    buildDate: now,
    modifiedType: ModelModifiedType.PARAMETER_TUNE,
    description: descriptionLines.join("\n\n"),
    trainingTime: 0,
    status: ModelStatus.INACTIVE,
  };
}
