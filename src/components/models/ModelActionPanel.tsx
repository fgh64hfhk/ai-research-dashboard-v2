// components/models/ModelActionPanel.tsx
"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { SlidersHorizontal, GitCompare, PlusCircle } from "lucide-react";

import { ModelVersion } from "@/types/model";
import { useState } from "react";
import { VersionCreateDialog } from "../version/VersionCreateDialog";
import { VersionFormValues } from "@/schemas/versionCreateSchema";
import { VersionFormData } from "@/types/form";
import { createVersion } from "@/lib/api/version/create";
import { toast } from "sonner";

interface ModelActionPanelProps {
  modelId: string;
  latestVersion?: ModelVersion;
  onOpenVersions?: () => void;
}

export function ModelActionPanel({
  modelId,
  latestVersion,
  onOpenVersions,
}: ModelActionPanelProps) {
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);

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

      // ✅ 模擬呼叫 API or localStorage
      console.log("API Result:", result);

      toast.success(`版本 ${result.version} 建立成功！`);
    } catch (err) {
      toast.error("版本建立失敗，請稍後再試");
      console.error(err);
    }
  };

  return (
    <Card>
      <CardTitle className="px-6">
        <h2 className="text-lg font-medium">常用操作</h2>
      </CardTitle>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() =>
              router.push(
                `/models/${modelId}/version/${latestVersion?.version}`
              )
            }
            disabled={!latestVersion}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" /> 查看最新版本
          </Button>
          <Button variant="secondary" onClick={onOpenVersions}>
            <SlidersHorizontal className="w-4 h-4 mr-2" /> 查看所有版本
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push(`/models/${modelId}/compare`)}
          >
            <GitCompare className="w-4 h-4 mr-2" /> 比較版本
          </Button>

          <Button variant="outline" onClick={() => setOpenDialog(true)}>
            <PlusCircle className="w-4 h-4 mr-2" /> 新增版本
          </Button>

          <VersionCreateDialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            modelId={modelId}
            onSubmit={handleSubmit}
          />
        </div>
      </CardContent>
    </Card>
  );
}
