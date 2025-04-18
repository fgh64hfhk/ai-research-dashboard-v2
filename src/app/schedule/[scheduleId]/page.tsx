"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { ScheduleGuideCard } from "@/components/schedule/ScheduleGuideCard";
import { ActionCard } from "@/components/common/ActionCard";
import { Badge } from "@/components/ui/badge";
import { IntroCard } from "@/components/common/PageIntroCard";
import { ScheduleInfoCard } from "@/components/schedule_page/ScheduleInfoCard";
import { useScheduleById } from "@/hooks/schedule/schedule.hooks";
import { PlayCircle, RefreshCcw, Settings2 } from "lucide-react";

export default function ScheduleDetailPage() {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const schedule = useScheduleById(scheduleId);

  return (
    <div className="container max-w-3xl py-8 px-4 md:px-8 space-y-6">
      {/* 🧭 區塊一：使用者引導說明卡片 */}
      <IntroCard
        title="🎯 這是模型的訓練排程詳細頁面，您可以："
        descriptionList={[
          "檢視排程的執行時間與任務狀態",
          "若尚未執行，可修改時間或取消任務",
          "訓練完成後，可查看訓練結果與紀錄",
          "若任務失敗，可重新安排排程",
        ]}
      />

      {/* 🧭 區塊二：標題與狀態 */}
      {/* 🧭 區塊三：排程詳情（關聯模型版本 / 時間 / 類型 等） */}
      <ScheduleInfoCard scheduleId={schedule?.id || ""} {...schedule} />

      {/* ✅ 區塊四：操作按鈕 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <ActionCard
          icon={<PlayCircle className="w-5 h-5" />}
          label="開始訓練"
          onClick={() => console.log("Start training")}
        />
        <ActionCard
          icon={<RefreshCcw className="w-5 h-5" />}
          label="重新排程"
          onClick={() => console.log("Reschedule")}
        />
        <ActionCard
          icon={<Settings2 className="w-5 h-5" />}
          label="編輯排程"
          onClick={() => console.log("Edit schedule")}
        />
      </div>

      {/* 🧭 區塊五：最新訓練結果摘要（可整合 TrainingResultCard） */}
      <div>
        <h2 className="text-lg font-semibold mb-2">訓練結果摘要</h2>
        {/* 👉 若尚未訓練，這邊顯示空狀態 */}
        {/* 👉 若已完成，可整合 <TrainingResultCard result={xxx} /> */}
        <Card className="p-6 text-sm text-muted-foreground">
          尚未有訓練結果
        </Card>
      </div>
    </div>
  );
}
