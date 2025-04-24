import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface VersionSelectToggleProps {
  baseVersionId: string;
  targetVersionId: string;
  versionOptions: string[];
  onBaseChange: (value: string) => void;
  onTargetChange: (value: string) => void;
  isLocked?: boolean;
}

const VersionSelectToggle: React.FC<VersionSelectToggleProps> = ({
  baseVersionId,
  targetVersionId,
  versionOptions,
  onBaseChange,
  onTargetChange,
  isLocked = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="space-y-1">
        <Label>比較對象：前一版本</Label>
        <Select
          value={baseVersionId}
          onValueChange={onBaseChange}
          disabled={isLocked}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="選擇版本" />
          </SelectTrigger>
          <SelectContent>
            {versionOptions.map((ver) => (
              <SelectItem
                key={ver}
                value={ver}
                disabled={ver === targetVersionId}
              >
                {ver}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>目前版本</Label>
        <Select
          value={targetVersionId}
          onValueChange={onTargetChange}
          disabled={isLocked}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="選擇版本" />
          </SelectTrigger>
          <SelectContent>
            {versionOptions.map((ver) => (
              <SelectItem
                key={ver}
                value={ver}
                disabled={ver === baseVersionId}
              >
                {ver}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VersionSelectToggle;
