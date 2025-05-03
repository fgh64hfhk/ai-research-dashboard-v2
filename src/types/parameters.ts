// 模型參數（ModelParameters）
export type ModelParameters = ModelParameterValues & {
  modelVersionId: string; // 綁定版本，但只是外部關聯
};

export type ModelParameterValues = {
  learningRate: number;
  batchSize: number;
  epochs: number;
  optimizer: "adam" | "sgd" | "rmsprop";
  lossFunction: "crossentropy" | "mse" | "categorical_crossentropy";
  datasetVersion: string;
  pretrainedModel: boolean;
  augmentation?: boolean; // Optional 比較合理
};
