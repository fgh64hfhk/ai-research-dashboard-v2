import { ModelParameters } from "@/types/parameters";
import { ModelParameterItem } from "@/components/models/ParameterView";

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

export function mapParametersToItems(
  parameters: ModelParameters
): ModelParameterItem[] {
  return Object.entries(parameters)
    .filter(([key]) => key !== "modelVersionId") // 避免顯示 metadata
    .map(([key, value]) => ({
      key,
      value,
      description: PARAMETER_DESCRIPTIONS[key] || "",
      group: PARAMETER_GROUPS[key] || "其他參數",
    }));
}
