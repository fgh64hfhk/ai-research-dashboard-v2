// 模型本體（Model, ModelVersion）
export type Model = {
  modelId: string;
  name: string;
  language: string;
  description: string;
};

export type ModelVersion = {
  modelId: string; // 對應的模型 ID
  version: string; // 版本號
  modifiedDate: string; // 修改日期
  modifiedType: string; // 變更類型
  trainingTime: number; // 訓練時間
  buildDate: string; // 構建日期
  status?: ModelStatus;
};

export enum ModelStatus {
  DEPLOYMENT_FAILED = "Deployment Failed",
  DEPLOYED = "Deployed",
  TRAINING = "Training",
  DEPLOYMENT_CANCELED = "Deployment Canceled",
  PENDING_DEPLOYMENT = "Pending Deployment",
  SCHEDULED = "Scheduled",
  INACTIVE = "Inactive",
}

export type ModelWithVersion = Model & {
  modelVersion?: ModelVersion; // 最新版本
};

export type ModelWithAllVersions = Model & {
  modelVersion?: ModelVersion[];
};
