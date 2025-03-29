import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { TrainingSchedule } from "@/types/schedule";
import { ScheduleStatusBadge } from "./ScheduleStatusBadge";

export function ScheduleCard({ schedule }: { schedule: TrainingSchedule }) {
  const router = useRouter();

  return (
    <Card className="p-4">
      <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <p className="font-medium">
            {schedule.modelId} - {schedule.version}
          </p>
          <p className="text-sm text-muted-foreground">
            預定執行：{format(new Date(schedule.runDate), "yyyy-MM-dd HH:mm")}
          </p>
          <p className="text-sm text-muted-foreground">
            建構時間：{schedule.buildDate}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <ScheduleStatusBadge status={schedule.status} />
          <Button
            variant="outline"
            onClick={() => router.push(`/schedule/${schedule.id}`)}
          >
            檢視
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
