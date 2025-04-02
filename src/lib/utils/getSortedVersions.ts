// lib/utils/getSortedVersions.ts
import { ModelVersion } from "@/types/model";

interface SortedVersion extends ModelVersion {
  isLatest: boolean;
}

export function getSortedVersions(
  versions: ModelVersion[],
  isDescending: boolean
): SortedVersion[] {
  const sorted = [...versions].sort((a, b) =>
    isDescending
      ? new Date(b.buildDate).getTime() - new Date(a.buildDate).getTime()
      : new Date(a.buildDate).getTime() - new Date(b.buildDate).getTime()
  );

  const latestIndex = isDescending ? 0 : sorted.length - 1;

  return sorted.map((v, idx) => ({
    ...v,
    isLatest: idx === latestIndex,
  }));
}
