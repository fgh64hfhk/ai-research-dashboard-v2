// lib/mock/mockTrainingResults.ts

import { TrainingResult } from "@/types/training";

export const mockTrainingResults: TrainingResult[] = [
  {
    scheduleId: "s001",
    modelId: "m001",
    version: "v1.0",
    status: "completed",
    trainingTime: 180,
    metrics: {
      accuracy: 0.91,
      loss: 0.18,
    },
    logs: [
      "Epoch 1/5 - acc: 0.7 - loss: 0.4",
      "Epoch 2/5 - acc: 0.75 - loss: 0.3",
      "Epoch 3/5 - acc: 0.82 - loss: 0.25",
      "Epoch 4/5 - acc: 0.88 - loss: 0.2",
      "Epoch 5/5 - acc: 0.91 - loss: 0.18",
    ],
    completedAt: "2025-04-20T18:00:00",
  },
  {
    scheduleId: "s002",
    modelId: "m001",
    version: "v1.1",
    status: "failed",
    trainingTime: 45,
    message: "GPU 記憶體不足導致中斷",
    logs: ["訓練中斷：CUDA out of memory"],
    completedAt: "2025-04-23T19:00:00",
  },

  // m002_v1.0_s004
  {
    scheduleId: "s004",
    modelId: "m002",
    version: "v1.0",
    status: "completed",
    trainingTime: 200,
    metrics: {
      accuracy: 0.71,
      loss: 0.28,
    },
    logs: [
      "Epoch 1/5 - acc: 0.6 - loss: 0.5",
      "Epoch 2/5 - acc: 0.63 - loss: 0.42",
      "Epoch 3/5 - acc: 0.66 - loss: 0.35",
      "Epoch 4/5 - acc: 0.69 - loss: 0.3",
      "Epoch 5/5 - acc: 0.71 - loss: 0.28",
    ],
    completedAt: "2025-04-30T13:00:00",
  },
  {
    scheduleId: "s004",
    modelId: "m002",
    version: "v1.0",
    status: "failed",
    trainingTime: 30,
    message: "GPU 記憶體不足導致中斷",
    logs: ["訓練中斷：CUDA out of memory"],
    completedAt: "2025-04-30T12:30:00",
  },
  // m002_v1.0_s005
  {
    scheduleId: "s005",
    modelId: "m002",
    version: "v1.0",
    status: "completed",
    trainingTime: 150,
    metrics: {
      accuracy: 0.89,
      loss: 0.22,
    },
    logs: [
      "Epoch 1/5 - acc: 0.7 - loss: 0.4",
      "Epoch 2/5 - acc: 0.75 - loss: 0.3",
      "Epoch 3/5 - acc: 0.82 - loss: 0.25",
      "Epoch 4/5 - acc: 0.88 - loss: 0.2",
      "Epoch 5/5 - acc: 0.89 - loss: 0.22",
    ],
    completedAt: "2025-05-02T13:00:00",
  },
  {
    scheduleId: "s005",
    modelId: "m002",
    version: "v1.0",
    status: "failed",
    trainingTime: 30,
    message: "GPU 記憶體不足導致中斷",
    logs: [
      "Epoch 1/5 - acc: 0.52 - loss: 0.48",
      "Epoch 2/5 - acc: 0.50 - loss: 0.49",
      "Epoch 3/5 - acc: 0.51 - loss: 0.50",
      "訓練中斷：Gradient explosion detected",
    ],
    completedAt: "2025-05-02T12:30:00",
  },

  // m002_v1.1_s006
  {
    scheduleId: "s006",
    modelId: "m002",
    version: "v1.1",
    status: "completed",
    trainingTime: 180,
    metrics: {
      accuracy: 0.91,
      loss: 0.19,
    },
    logs: [
      "Epoch 1/6 - acc: 0.69 - loss: 0.42",
      "Epoch 2/6 - acc: 0.75 - loss: 0.33",
      "Epoch 3/6 - acc: 0.72 - loss: 0.36", // 回跌
      "Epoch 4/6 - acc: 0.80 - loss: 0.28",
      "Epoch 5/6 - acc: 0.86 - loss: 0.24",
      "Epoch 6/6 - acc: 0.91 - loss: 0.19",
    ],
    completedAt: "2025-05-06T13:00:00",
  },
  // m002_v1.2_s007
  {
    scheduleId: "s007",
    modelId: "m002",
    version: "v1.2",
    status: "completed",
    trainingTime: 210,
    metrics: {
      accuracy: 0.94,
      loss: 0.13,
    },
    logs: [
      "Epoch 1/6 - acc: 0.72 - loss: 0.36",
      "Epoch 2/6 - acc: 0.69 - loss: 0.29",
      "Epoch 3/6 - acc: 0.87 - loss: 0.32",
      "Epoch 4/6 - acc: 0.91 - loss: 0.17",
      "Epoch 5/6 - acc: 0.92 - loss: 0.18",
      "Epoch 6/6 - acc: 0.94 - loss: 0.13",
    ],
    completedAt: "2025-05-09T13:00:00",
  },
];
