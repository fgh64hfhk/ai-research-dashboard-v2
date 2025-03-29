"use client";

import { InfoRowGroup } from "@/components/schedule/InfoRowGroup";
import { InfoRow } from "@/components/schedule/InfoRow";

import { Info, CalendarClock, Cpu } from "lucide-react";

export default function TestPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">InfoRow 測試</h1>

      <InfoRowGroup columns={2}>
        <InfoRow
          label="模型 ID"
          value="gpt-4-finance-expert-v2"
          icon={<Cpu size={16} />}
          tooltip="模型唯一識別碼"
        />
        <InfoRow label="建構版本" value="v1.2.8" icon={<Info size={16} />} />
        <InfoRow
          label="執行時間"
          value="2025-04-01 14:00"
          icon={<CalendarClock size={16} />}
        />
        <InfoRow
          label="訓練資料集"
          value="large-dataset-openfin-ai-2024-v3"
          tooltip="資料集來自 2024 年金融開放資料整理"
        />
      </InfoRowGroup>
    </div>
  );
}
