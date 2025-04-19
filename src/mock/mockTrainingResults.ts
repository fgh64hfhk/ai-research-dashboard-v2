// lib/mock/mockTrainingResults.ts

import { TrainingResult } from "@/types/training";

export const mockTrainingResults: TrainingResult[] = [
  {
    scheduleId: "s001",
    modelId: "m001",
    version: "v1.0",
    status: "completed",
    trainingTime: 101,
    metrics: {
      accuracy: 0.91,
      loss: 0.18,
    },
    logs: [
      "Epoch 1/5 - acc: 0.91 - loss: 0.21",
      "Epoch 2/5 - acc: 0.87 - loss: 0.16",
      "Epoch 3/5 - acc: 0.94 - loss: 0.18",
      "Epoch 4/5 - acc: 0.86 - loss: 0.19",
      "Epoch 5/5 - acc: 0.91 - loss: 0.20",
    ],
    completedAt: "2025-04-19T17:07:00Z",
  },
  // {
  //   scheduleId: "s001",
  //   modelId: "m001",
  //   version: "v1.0",
  //   status: "failed",
  //   trainingTime: 45,
  //   message: "GPU 記憶體不足導致中斷",
  //   logs: ["訓練中斷：CUDA out of memory"],
  //   completedAt: "2025-04-19T17:07:00",
  // },
];
