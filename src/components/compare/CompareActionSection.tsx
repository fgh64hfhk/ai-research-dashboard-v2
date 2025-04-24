import { Card, CardContent } from "@/components/ui/card";
import VersionSelectToggle from "@/components/compare/VersionSelectToggle";
import VersionActionPanel from "@/components/compare/VersionActionPanel";
// import VersionNoteEditor from "@/components/compare/VersionNoteEditor";

interface CompareActionSectionProps {
  baseVersionId: string;
  targetVersionId: string;
  versionOptions: string[];
  isLocked: boolean;
  onBaseChange: (versionId: string) => void;
  onTargetChange: (versionId: string) => void;
  onCreateNewVersion: () => void;
  onReschedule: () => void;
  onEditNote: () => void;
  defaultNote?: string;
}

const CompareActionSection: React.FC<CompareActionSectionProps> = ({
  baseVersionId,
  targetVersionId,
  versionOptions,
  isLocked,
  onBaseChange,
  onTargetChange,
  onCreateNewVersion,
  onReschedule,
  onEditNote,
}) => {
  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="text-lg font-semibold">版本操作區塊</div>

        {/* 🔁 區塊一：版本選擇器 */}
        <VersionSelectToggle
          baseVersionId={baseVersionId}
          targetVersionId={targetVersionId}
          versionOptions={versionOptions}
          onBaseChange={onBaseChange}
          onTargetChange={onTargetChange}
        />

        {/* 🛠 區塊二：操作按鈕卡片 */}
        <VersionActionPanel
          onCreateNewVersion={onCreateNewVersion}
          onReschedule={onReschedule}
          onEditNote={onEditNote}
          isLocked={isLocked}
        />

        {/* 📝 區塊三：備註編輯器 */}
        {/* <VersionNoteEditor
          versionId={targetVersionId}
          defaultNote={defaultNote}
          disabled={isLocked}
        /> */}

        {/* 🔧 預留：擴充功能 1（如：導出報告） */}
        {/* <ExportCompareReportButton /> */}

        {/* 🧠 預留：擴充功能 2（如：追蹤版本比較記錄） */}
        {/* <TrackVersionCompareToggle /> */}
      </CardContent>
    </Card>
  );
};

export default CompareActionSection;
