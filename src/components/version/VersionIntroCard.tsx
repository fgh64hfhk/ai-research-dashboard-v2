// components/version/VersionIntroCard.tsx
"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

export function VersionIntroCard() {
  return (
    <Card className="flex flex-col md:flex-row items-center gap-6 p-6">
      <Image
        src="/version-guide.gif"
        alt="version-guide"
        width={200}
        height={200}
        className="rounded-md"
        priority
        unoptimized
      />
      <div className="space-y-2 text-sm text-muted-foreground">
        <p className="text-base font-medium text-foreground">
          這是該模型版本的詳細頁，您可以：
        </p>
        <ul className="list-disc ml-5 space-y-1">
          <li>查看版本基本資訊與訓練狀態</li>
          <li>檢視或設定模型訓練參數</li>
          <li>新增或管理訓練排程</li>
          <li>若尚未設定參數與排程，請盡快完成！</li>
        </ul>
      </div>
    </Card>
  );
}
