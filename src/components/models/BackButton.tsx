// components/model/BackButton.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  const { modelId } = useParams<{ modelId: string }>();

  return (
    <Button
      variant="outline"
      onClick={() => router.push(`/models/${modelId}`)}
      className="flex items-center gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      返回模型總覽
    </Button>
  );
}
