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
      <InfoRow label="最新版本：" value={version.version} emphasize />
      <InfoRow
        label="修改摘要："
        value={`${version.modifiedType} - ${format(
          new Date(version.modifiedDate),
          "yyyy-MM-dd HH:mm"
        )}`}
      />
      <InfoRow
        label="創建日期："
        value={format(new Date(version.buildDate), "yyyy-MM-dd HH:mm")}
      />
      <InfoRow label="訓練時間：" value={`${version.trainingTime} s`} />

      {parameters ? (
        <InfoRow
          label="訓練參數摘要："
          value={`LR: ${parameters.learningRate}, Epochs: ${parameters.epochs}`}
        />
      ) : (
        <InfoRow label="訓練參數摘要：" />
      )}

      {schedule ? (
        <InfoRow
          label="下次訓練摘要："
          value={format(new Date(schedule.runDate), "MM-dd HH:mm")}
        />
      ) : (
        <InfoRow label="下次訓練摘要：" />
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value?: string | number;
  emphasize?: boolean;
}) {
  return (
    <p className="text-muted-foreground">
      {label}
      <span className={emphasize ? "text-foreground font-medium ml-1" : "ml-1"}>
        {value ?? "查無資料"}
      </span>
    </p>
  );
}
