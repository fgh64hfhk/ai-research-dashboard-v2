"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { VersionCreateForm } from "@/components/version/VersionCreateForm";

import { createVersion } from "@/lib/api/version/create";
import { VersionFormData } from "@/types/form";
import { VersionFormValues } from "@/schemas/versionCreateSchema";

export default function VersionCreatePage() {
  const { modelId } = useParams<{ modelId: string }>();
  const router = useRouter();

  const handleSubmit = async (formData: VersionFormValues) => {
    try {
      const payload: VersionFormData = {
        modelId,
        version: formData.version,
        modifiedType: formData.modifiedType,
        modelFile: formData.modelFile,

        buildDate: new Date().toISOString(),
        trainingTime: 0,
        status: "inactive",
      };

      const result = await createVersion(payload);

      toast.success(`版本 ${result.version} 建立成功！`);
      router.push(`/models/${modelId}/version/${result.version}`);
    } catch (err) {
      toast.error("版本建立失敗，請稍後再試");
      console.error(err);
    }
  };

  if (!modelId) {
    return (
      <div className="container max-w-3xl py-8">
        <p className="text-destructive">無法識別模型 ID，請返回上一頁。</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <h1 className="text-2xl font-bold">為模型 {modelId} 建立新版本</h1>
      <p className="text-muted-foreground">
        請填寫下列資訊來建立新版本，包括修改摘要、初始參數設定與模型檔案上傳。
      </p>

      <VersionCreateForm modelId={modelId} onSubmit={handleSubmit} />
    </div>
  );
}
