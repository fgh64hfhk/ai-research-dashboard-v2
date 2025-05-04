// lib/utils/parameter.helper.ts
import { ModelParameters } from "@/types/parameters";
import { ModelParameterItem } from "@/components/parameter/ParameterView";
import { ParameterItem } from "@/components/compare/ParameterCompareCard";

// ✅ 參數描述：用於 UI 顯示說明
const PARAMETER_DESCRIPTIONS: Record<string, string> = {
  learningRate: "模型學習率，控制每次參數更新的步伐。",
  batchSize: "每次訓練所使用的樣本數量。",
  epochs: "訓練資料重複訓練的次數。",
  optimizer: "使用的優化演算法，例如 Adam、SGD 等。",
  lossFunction: "損失函數，用於計算預測與實際值的差距。",
  datasetVersion: "訓練使用的資料集版本。",
  pretrainedModel: "是否使用預先訓練的模型作為基礎。",
  augmentation: "是否在訓練過程中使用資料增強技術。",
};

// ✅ 群組對應設定：用於 UI 分群顯示
const PARAMETER_GROUPS: Record<string, string> = {
  learningRate: "優化器設定",
  optimizer: "優化器設定",
  batchSize: "訓練設定",
  epochs: "訓練設定",
  lossFunction: "訓練設定",
  datasetVersion: "資料設定",
  pretrainedModel: "模型初始化",
  augmentation: "資料設定",
};

// ✅ 主要轉換工具：將參數轉為 UI 顯示用的結構
export function mapParametersToItems(
  parameters: ModelParameters
): ModelParameterItem[] {
  return Object.entries(parameters)
    .filter(([key]) => key !== "modelVersionId")
    .map(([key, value]) => ({
      key,
      value,
      description: PARAMETER_DESCRIPTIONS[key] || "",
      group: PARAMETER_GROUPS[key] || "其他參數",
    }));
}

// 🚧（可擴充）：格式化參數值，例如布林值轉換
export function formatParameterValue(
  value: string | number | boolean | object | null | undefined
): string {
  if (typeof value === "boolean") return value ? "是" : "否";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

// ✅ 工具函數：取得參數的 map key
export function getParameterKey(modelId: string, version: string): string {
  return `${modelId}_${version}`;
}

export function convertParamsToCompareItems(
  baseParams?: ModelParameters,
  targetParams?: ModelParameters
): ParameterItem[] {
  if (!baseParams && !targetParams) return [];

  // 合併兩邊都有的 key
  const keys = Array.from(
    new Set([
      ...Object.keys(baseParams || {}),
      ...Object.keys(targetParams || {}),
    ])
  ).filter((key) => key !== "modelVersionId"); // 排除 meta 欄位

  return keys.map((key) => ({
    key,
    baseValue:
      baseParams && key in baseParams
        ? String(baseParams[key as keyof ModelParameters])
        : "-",
    targetValue:
      targetParams && key in targetParams
        ? String(targetParams[key as keyof ModelParameters])
        : "-",
  }));
}

import { TrainingInsight } from "@/lib/utils/insight.helper";

export function autoTuneParameters(
  baseParams: ModelParameters,
  insightSummary: TrainingInsight
): ModelParameters {
  const tunedParams: ModelParameters = { ...baseParams };

  if (!baseParams || !insightSummary) return tunedParams;

  const isCompareMode = insightSummary.insights.some(
    (item) => item.type === "compare"
  );

  if (isCompareMode) {
    /** ========== 基於比較結果（acc/loss）調整 ========== **/

    if (
      insightSummary.accImprove !== undefined &&
      insightSummary.accImprove < 0
    ) {
      // Accuracy 下降：降 learningRate
      tunedParams.learningRate = Math.max(
        baseParams.learningRate * 0.8,
        0.0001
      );
    }
    if (
      insightSummary.lossImprove !== undefined &&
      insightSummary.lossImprove < 0
    ) {
      // Loss 上升：降 learningRate
      tunedParams.learningRate = Math.max(
        tunedParams.learningRate * 0.8,
        0.0001
      );
    }

    /** ========== 基於新版本自身趨勢（label）調整 ========== **/
    const baseInsightTexts = insightSummary.insights
      .filter((i) => i.type === "base")
      .map((i) => i.label)
      .join(" ");

    if (
      baseInsightTexts.includes("提升幅度") &&
      baseInsightTexts.includes("改善幅度")
    ) {
      // 如果有"提升幅度" && "改善幅度" 代表本版有明顯進步，可以加強訓練

      if (typeof tunedParams.batchSize === "number") {
        tunedParams.batchSize = Math.min(tunedParams.batchSize * 2, 128); // 提升 batchSize
      }

      if (typeof tunedParams.epochs === "number") {
        tunedParams.epochs = tunedParams.epochs + 4; // 增加 epochs
      }

      tunedParams.augmentation = true; // 開啟資料增強

      /** ========== 資料集版本升級（視需求決定是否開放） ========== **/

      if (tunedParams.datasetVersion === "Chinese-MedQA-v2") {
        tunedParams.datasetVersion = "Chinese-MedQA-v3";
      }
    }
  } else {
    /** ========== 基於初始版本自身趨勢（label）調整 ========== **/
    const texts = insightSummary.insights.map((i) => i.label).join(" ");

    // 大幅改善時，微調以增強穩定性
    if (texts.includes("提升幅度") && texts.includes("改善幅度")) {
      // 提升 batch size
      if (typeof tunedParams.batchSize === "number") {
        tunedParams.batchSize = Math.min(tunedParams.batchSize * 2, 128);
      }
      // 增加 epochs
      if (typeof tunedParams.epochs === "number") {
        tunedParams.epochs = tunedParams.epochs + 2;
      }
      // 開啟資料增強
      tunedParams.augmentation = true;
    }
    tunedParams.datasetVersion = "Chinese-MedQA-v2";
  }

  return tunedParams;
}
