import React from "react";

// 📌 引導卡片標題
export function renderIntroTitle(count: number, modelName?: string) {
  if (count === 0) return "尚未建立任何模型版本";
  return `比較模型：${modelName || "未命名模型"}`;
}

// 引導卡片描述列表
export function renderIntroDescriptionList(
  count: number,
  baseVersion?: string,
  targetVersion?: string
): React.ReactNode[] {
  if (count === 0) {
    return [
      "此模型尚未建立任何版本，無法進行訓練結果比較。",
      "請先建立初始版本以開始訓練與版本優化。",
    ];
  }
  if (count === 1) {
    return [
      <>
        目前僅有<b>{baseVersion}</b> 這個初始版本，尚無其他版本可供比較。
      </>,
      "請根據目前的訓練成果進行優化，建立新版本以持續迭代。",
    ];
  }

  return [
    <>
      您目前正在比較<b>版本（{baseVersion}）</b>與<b>版本（{targetVersion}）</b>
      的訓練成果。
    </>,
    <>
      每個版本的成果皆取自其最近一次排程中的 <b>最終訓練結果</b>。
    </>,
    "若訓練失敗，該版本將視為「不可部署」。",
    "請根據下方的參數設定與訓練指標差異，決定是否建立新版本以持續優化。",
  ];
}

// 針對單一版本顯示的空狀態提示
export function renderInsightPlaceholder(versionId: string): string {
  return `目前僅有版本 ${versionId}，尚無比較資料可進行前瞻分析。請建立新版本以持續優化。`;
}
