"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { PageIntroCard } from "@/components/guidance/PageIntroCard";
import { ScheduleFilterBar } from "@/components/schedule";
import { CalendarClock } from "lucide-react";

export default function TaskListPage() {
  return (
    <div className="container max-w-5xl py-8 px-4 md:px-8 space-y-6">
      {/* 1. 引導卡片 */}
      <PageIntroCard
        title="這裡是訓練排程總覽頁 🔁"
        descriptionList={[
          "審核與追蹤所有模型版本的訓練排程",
          "點擊進入排程查看進度與訓練結果",
          "透過篩選功能查找指定模型的排程",
        ]}
      />

      {/* 2. 篩選列（即使無資料也需顯示） */}
      <ScheduleFilterBar disabled />

      {/* 3. 空狀態提示 */}
      <EmptyState
        icon={<CalendarClock className="w-10 h-10 text-blue-500" />}
        title="目前沒有任何訓練排程"
        description="尚未建立任何訓練任務，請由模型版本頁面新增訓練排程。"
      />
    </div>
  );
}
