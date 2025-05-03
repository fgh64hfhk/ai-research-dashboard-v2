// lib/utils/version.helper.ts
import { VersionActivateFormValues } from "@/schemas/versionActivateSchema";
import { ModelVersion } from "@/types/model";

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

interface GeneratePreFilledVersionOptions {
  modelId: string;
  baseVersion: string; // 例如 v1.0
}

export function generatePreFilledVersion({
  modelId,
  baseVersion,
}: GeneratePreFilledVersionOptions): VersionActivateFormValues {
  const nextVersion = getNextVersionString(baseVersion, "minor");

  return {
    modelId,
    version: nextVersion,
    modifiedType: "激活比較功能",
    description: "此版本用於激活模型版本比較功能",
  };
}
