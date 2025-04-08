// app/debug/model/[id]/page.tsx
import { ParameterDebug } from "@/components/debug/ParameterDebug";
import { ScheduleDebug } from "@/components/debug/ScheduleDebug";
import { ModelVersionDebug } from "@/components/debug/ModelVersionDebug";

interface Props {
  params: { id: string };
}

export default function ModelDebugPage({ params }: Props) {
  const modelId = params.id;

  return (
    <div className="container max-w-4xl py-10 space-y-6">
      <h1 className="text-xl font-bold">Debug 模型資料（{modelId}）</h1>

      <ModelVersionDebug modelId={modelId} />

      {/* 假設你要 debug 某個版本，比如 v1 */}
      <ParameterDebug modelId={modelId} version="v1.0" />
      <ScheduleDebug modelId={modelId} version="v1.0" />
    </div>
  );
}
