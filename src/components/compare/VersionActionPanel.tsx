import React from "react";
import { PlayCircle, PlusCircle, RefreshCw } from "lucide-react";
import { ActionCard } from "@/components/common/ActionCard";

interface VersionActionPanelProps {
  onCreateNewVersion?: () => void;
  onReschedule?: () => void;
  onEditNote?: () => void;
  isLocked?: boolean;
  isInitialVersion?: boolean;
}

export default function VersionActionPanel({
  onCreateNewVersion,
  onReschedule,
  onEditNote,
  isLocked = false,
  isInitialVersion = false,
}: VersionActionPanelProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <ActionCard
        icon={<PlusCircle className="w-5 h-5" />}
        label={isInitialVersion ? "建立第二版（啟用比較）" : "建立新版本"}
        onClick={onCreateNewVersion}
        variant={isInitialVersion ? "success" : "default"}
        disabled={isLocked}
      />
      <ActionCard
        icon={<RefreshCw className="w-5 h-5" />}
        label="重新訓練此版本"
        onClick={onReschedule}
        disabled={true}
      />
      <ActionCard
        icon={<PlayCircle className="w-5 h-5" />}
        label="編輯說明（小更新）"
        onClick={onEditNote}
        disabled={true}
      />
    </div>
  );
}
