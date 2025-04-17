// lib/mock/mockTrainingResults.ts

import { TrainingResult } from "@/types/schedule";

export const mockTrainingResults: TrainingResult[] = [
  {
    scheduleId: "s001",
    modelId: "model-alpha",
    version: "v1.0",
    status: "completed",
    trainingTime: 180,
    metrics: {
      accuracy: 0.91,
      loss: 0.18,
    },
    logs: [
      "Epoch 1/5 - acc: 0.83 - loss: 0.29",
      "Epoch 2/5 - acc: 0.89 - loss: 0.21",
      "Epoch 5/5 - acc: 0.91 - loss: 0.18",
    ],
    completedAt: "2025-04-15T14:30:00Z",
  },
  {
    scheduleId: "schedule_1002",
    modelId: "model-beta",
    version: "v2.1",
    status: "failed",
    trainingTime: 45,
    message: "GPU 記憶體不足導致中斷",
    logs: ["訓練中斷：CUDA out of memory"],
    completedAt: "2025-04-15T15:10:00Z",
  },
  {
    scheduleId: "schedule_1003",
    modelId: "model-alpha",
    version: "v1.1",
    status: "completed",
    trainingTime: 240,
    metrics: {
      accuracy: 0.93,
      loss: 0.15,
    },
    logs: [
      "Epoch 1/5 - acc: 0.86 - loss: 0.25",
      "Epoch 2/5 - acc: 0.90 - loss: 0.19",
      "Epoch 5/5 - acc: 0.93 - loss: 0.15",
    ],
    completedAt: "2025-04-16T10:45:00Z",
  },
];
