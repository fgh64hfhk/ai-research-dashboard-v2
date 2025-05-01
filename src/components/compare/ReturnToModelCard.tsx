// components/compare/ReturnToModelCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ActionCard } from "@/components/common/ActionCard";

interface Props {
  modelId: string;
}

export default function ReturnToModelCard({ modelId }: Props) {
  const router = useRouter();

  return (
    <ActionCard
      icon={<ArrowLeft className="w-5 h-5 text-muted-foreground" />}
      label="返回模型詳細頁面"
      onClick={() => router.push(`/models/${modelId}`)}
      variant="default"
    />
  );
}
