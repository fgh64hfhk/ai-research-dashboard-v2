"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PlusCircle, Search, Clock, GitCompare } from "lucide-react";

export function ModelsActionPanel() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">快速操作</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          onClick={() => {
            router.push("/models/create");
          }}
          className="group cursor-pointer transition border hover:shadow-md p-4 flex items-center gap-4 rounded-xl hover:bg-accent"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-foreground group-hover:underline">
            建立新模型
          </span>
        </Card>

        <Card
          onClick={() => {
            router.push("/models?filter=open");
          }}
          className="group cursor-pointer transition border hover:shadow-md p-4 flex items-center gap-4 rounded-xl hover:bg-accent"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
            <Search className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-foreground group-hover:underline">
            探索所有模型
          </span>
        </Card>

        <Card
          onClick={() => {
            router.push("/models/recent");
          }}
          className="group cursor-pointer transition border hover:shadow-md p-4 flex items-center gap-4 rounded-xl hover:bg-accent"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-foreground group-hover:underline">
            查看最近更新
          </span>
        </Card>

        <Card
          onClick={() => {
            router.push("/models/compare");
          }}
          className="group cursor-pointer transition border hover:shadow-md p-4 flex items-center gap-4 rounded-xl hover:bg-accent"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
            <GitCompare className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-foreground group-hover:underline">
            比較模型版本
          </span>
        </Card>
      </div>
    </div>
  );
}
