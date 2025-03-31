import { ModelList } from "@/components/models/ModelList";

export default function ModelsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">模型總覽</h1>
      <ModelList />
    </main>
  );
}
