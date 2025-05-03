"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScheduleSummaryCard } from "@/components/schedule/";
import { EmptyState } from "@/components/common/EmptyState";

import { splitSchedules } from "@/lib/utils/schedule.helper"; // 剛剛定義好的小工具
import { TrainingSchedule } from "@/types/schedule";

import { History } from "lucide-react";
import { scrollToAnchor } from "@/lib/utils/common.helper";

export function ScheduleListPanel({
  schedules,
}: {
  schedules: TrainingSchedule[];
}) {
  const { latest, history } = splitSchedules(schedules);

  const handleAccordionChange = (val: string) => {
    if (val === "history") {
      scrollToAnchor("history_view", 200);
    }
  };

  return (
    <div className="space-y-8">
      {/* 最新排程 */}
      <div>
        {latest ? (
          <>
            <h2 className="text-xl font-semibold mb-4">最新排程</h2>
            <ScheduleSummaryCard schedule={latest} />
          </>
        ) : (
          <EmptyState
            icon={<History className="w-10 h-10" />}
            title="尚無排程"
            description="請為此版本新增一個排程。"
          />
        )}
      </div>

      {/* 歷史排程 */}
      {history.length > 0 && (
        <Accordion
          type="single"
          collapsible
          className="w-full"
          onValueChange={handleAccordionChange}
        >
          <AccordionItem value="history">
            <AccordionTrigger className="text-lg font-medium">
              查看歷史排程（{history.length}筆）
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4" id="history_view">
              {history.map((schedule) => (
                <ScheduleSummaryCard
                  key={schedule.scheduleId}
                  schedule={schedule}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
