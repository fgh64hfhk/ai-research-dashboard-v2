"use client";

import { ModelVersion } from "@/types/model";
import { ModelParameters } from "@/types/parameters";
import { TrainingSchedule } from "@/types/schedule";
import { format } from "date-fns";

interface Props {
  version: ModelVersion;
  parameters?: ModelParameters;
  schedule?: TrainingSchedule;
}

export function ModelVersionPreview({ version, parameters, schedule }: Props) {
  return (
    <div className="text-xs space-y-1">
      <p className="text-muted-foreground">
        最新版本：
        <span className="text-foreground font-medium">{version.version}</span>
      </p>

      <p className="text-muted-foreground">
        修改摘要：{version.modifiedType} -{" "}
        {format(new Date(version.modifiedDate), "yyyy-MM-dd HH:mm")}
      </p>

      <p className="text-muted-foreground">
        創建日期：
        {format(new Date(version.buildDate), "yyyy-MM-dd HH:mm")}
      </p>

      <p className="text-muted-foreground">
        訓練時間：
        {version.trainingTime} s
      </p>
      {parameters && (
        <p className="text-muted-foreground">
          訓練參數摘要：LR: {parameters.learningRate}, Epochs: {parameters.epochs}
        </p>
      )}
      {schedule ? (
        <p className="text-muted-foreground">
          下次訓練：{format(new Date(schedule.runDate), "MM-dd HH:mm")}
        </p>
      ): <p className="text-muted-foreground">查無資料</p>}
    </div>
  );
}
