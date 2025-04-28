"use client";

import { Clock, GitCompare, PlusCircle, Search } from "lucide-react";
import { ActionCard } from "@/components/common/ActionCard";

interface ModelsActionPanelProps {
  onOpenCreateDialog?: () => void;
}

export default function ModelsActionPanel({
  onOpenCreateDialog,
}: ModelsActionPanelProps) {
  const features = [
    {
      label: "建立新模型",
      icon: <PlusCircle className="w-5 h-5" />,
      onClick: onOpenCreateDialog,
      enabled: true,
    },
    {
      label: "查詢模型",
      icon: <Search className="w-5 h-5" />,
      enabled: false, // 預留
    },
    {
      label: "查詢訓練結果",
      icon: <Clock className="w-5 h-5" />,
      enabled: false, // 預留
    },
    {
      label: "比較模型版本",
      icon: <GitCompare className="w-5 h-5" />,
      enabled: false, // 預留
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) =>
          feature.enabled ? (
            <ActionCard
              key={feature.label}
              icon={feature.icon}
              label={feature.label}
              onClick={feature.onClick}
            />
          ) : (
            <div
              key={feature.label}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-400 h-full"
            >
              {feature.icon}
              <div className="mt-2 text-sm">{feature.label}（即將開放）</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
