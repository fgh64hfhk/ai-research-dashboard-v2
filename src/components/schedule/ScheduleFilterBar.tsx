import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const ScheduleFilterBar = ({ disabled = false }: { disabled?: boolean }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
      {/* 搜尋欄位：模型名稱或版本 */}
      <Input
        placeholder="搜尋模型名稱或版本"
        className="max-w-sm"
        disabled={disabled}
      />

      {/* 狀態篩選 */}
      <div className="flex items-center gap-2">
        <Select disabled={disabled}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="全部狀態" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部狀態</SelectItem>
            <SelectItem value="scheduled">待訓練</SelectItem>
            <SelectItem value="inProgress">訓練中</SelectItem>
            <SelectItem value="success">已完成</SelectItem>
            <SelectItem value="failed">失敗</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" disabled={disabled}>
          重設
        </Button>
      </div>
    </div>
  );
};

export default ScheduleFilterBar;
