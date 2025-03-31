// 模型參數（ModelParameters）
export type ModelParameters = {
  modelVersionId: string; // 綁定的模型版本 ID
  learningRate: number; // 學習率
  batchSize: number; // 訓練批次大小
  epochs: number; // 訓練週期數
  optimizer: "adam" | "sgd" | "rmsprop"; // 優化器選項
  lossFunction: "crossentropy" | "mse"; // 損失函數
  datasetVersion: string; // 資料集版本
  pretrainedModel: boolean; // 是否使用預訓練模型
  augmentation: boolean; // 是否啟用數據增強
};
