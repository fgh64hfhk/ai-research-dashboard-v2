// app/debug/model/page.tsx
import { ModelListDebug } from "@/components/debug/ModelListDebug";

export default function ModelDebugIndexPage() {
  return (
    <div className="container max-w-5xl py-10 space-y-6">
      <h1 className="text-xl font-bold">模型列表（Debug）</h1>
      <ModelListDebug />
    </div>
  );
}
