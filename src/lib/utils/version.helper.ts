/**
 * 根據當前版本與更新類型回傳下一版號
 * @param current 當前版本號，如 "v1.0"
 * @param type 更新類型：major（大版本）或 minor（小版本）
 * @returns 下一個版本號字串
 */
export function getNextVersion(
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
