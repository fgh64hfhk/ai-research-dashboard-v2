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
    completedAt: "2025-04-20T18:00:00Z",
  },
  {
    scheduleId: "s002",
    modelId: "m001",
    version: "v1.0",
    status: "failed",
    trainingTime: 45,
    message: "GPU 記憶體不足導致中斷",
    logs: ["訓練中斷：CUDA out of memory"],
    completedAt: "2025-04-20T19:00:00",
  },
  {
    scheduleId: "s003",
    modelId: "m001",
    version: "v1.1",
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
    completedAt: "2025-04-23T18:00:00Z",
  },
  {
    scheduleId: "s004",
    modelId: "m001",
    version: "v1.1",
    status: "failed",
    trainingTime: 30,
    message: "GPU 記憶體不足導致中斷",
    logs: ["訓練中斷：CUDA out of memory"],
    completedAt: "2025-04-23T19:00:00",
  },
];
