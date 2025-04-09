// app/schedule/create/page.tsx
"use client";

import { ScheduleCreateForm } from "@/components/schedule/ScheduleCreateForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScheduleCreatePage() {
  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">新增訓練排程</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleCreateForm />
        </CardContent>
      </Card>
    </div>
  );
}
