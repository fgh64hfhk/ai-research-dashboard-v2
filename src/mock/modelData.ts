import { ModelWithVersion, ModelStatus } from "@/types/model";
import { ModelParameters } from "@/types/parameters";
import { TrainingSchedule } from "@/types/schedule";

export const mockModels: ModelWithVersion[] = [
  {
    modelId: "m001",
    name: "GPT-4 Finance",
    language: "en-US",
    description:
      "A large language model fine-tuned for financial report analysis.",
    modelVersion: {
      modelId: "m001",
      version: "v1.2",
      modifiedDate: "2025-03-25",
      modifiedType: "hyperparameter update",
      trainingTime: 3600,
      buildDate: "2025-03-20",
      status: ModelStatus.TRAINING,
    },
  },
  {
    modelId: "m002",
    name: "BERT Medical QA",
    language: "zh-TW",
    description: "中文醫療問答語料專用 BERT 模型。",
    modelVersion: {
      modelId: "m002",
      version: "v2.0",
      modifiedDate: "2025-02-28",
      modifiedType: "dataset updated",
      trainingTime: 2400,
      buildDate: "2025-02-25",
      status: ModelStatus.DEPLOYED,
    },
  },
];

export const mockModelParameters: Record<string, ModelParameters> = {
  "m001_v1.2": {
    modelVersionId: "m001_v1.2",
    learningRate: 0.001,
    batchSize: 32,
    epochs: 10,
    optimizer: "adam",
    lossFunction: "crossentropy",
    datasetVersion: "fin-v3",
    pretrainedModel: true,
    augmentation: false,
  },
  "m002_v2.0": {
    modelVersionId: "m002_v2.0",
    learningRate: 0.0005,
    batchSize: 16,
    epochs: 8,
    optimizer: "rmsprop",
    lossFunction: "mse",
    datasetVersion: "medqa-tw-v2",
    pretrainedModel: false,
    augmentation: true,
  },
};

export const mockSchedules: TrainingSchedule[] = [
  {
    id: "s001",
    modelId: "m001",
    version: "v1.2",
    buildDate: "2025-03-20",
    runDate: "2025-03-27T10:00:00Z",
    status: "scheduled",
    createdAt: "2025-03-25T08:00:00Z",
  },
  {
    id: "s002",
    modelId: "m001",
    version: "v1.2",
    buildDate: "2025-03-20",
    runDate: "2025-03-28T09:00:00Z",
    status: "running",
    createdAt: "2025-03-26T10:00:00Z",
  },
  {
    id: "s003",
    modelId: "m002",
    version: "v2.0",
    buildDate: "2025-02-25",
    runDate: "2025-03-15T08:00:00Z",
    status: "completed",
    createdAt: "2025-03-10T10:00:00Z",
  },
];
