"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  versionActivateSchema,
  VersionActivateFormValues,
} from "@/schemas/versionActivateSchema";
import { GenerateMode, ModelModifiedType } from "@/types/model";
import { useEffect, useState } from "react";

interface VersionActivateFormProps {
  modelId: string;
  defaultValues: VersionActivateFormValues;
  onSubmit: (formData: VersionActivateFormValues) => void;
  mode: GenerateMode;
}

export function VersionActivateForm({
  modelId,
  defaultValues,
  onSubmit,
  mode,
}: VersionActivateFormProps) {
  const form = useForm<VersionActivateFormValues>({
    resolver: zodResolver(versionActivateSchema),
    defaultValues: {
      ...defaultValues,
      modelId, // 強制覆蓋 modelId 以防外部傳錯
    },
  });
  const [descriptionEdited, setDescriptionEdited] = useState(false);

  const isInitial = mode === "initialActivation";

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "modifiedType" && !descriptionEdited) {
        const suggestion = getDescriptionSuggestion(value.modifiedType!);
        form.setValue("description", suggestion);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, descriptionEdited]);

  return (
    <Form {...form}>
      <form
        id="version-activate-form"
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          console.warn(error);
        })}
        className="space-y-6"
      >
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* 🔹版本號（不可編輯） */}
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>版本號</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🔹修改類型 */}
            {isInitial ? (
              <FormField
                control={form.control}
                name="modifiedType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>修改類型</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="modifiedType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>修改類型</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇修改類型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ModelModifiedType.PARAMETER_TUNE}>
                          參數調整
                        </SelectItem>
                        <SelectItem value={ModelModifiedType.DATASET_EXPANSION}>
                          資料集擴增
                        </SelectItem>
                        <SelectItem value={ModelModifiedType.STRUCTURE_CHANGE}>
                          模型架構修改
                        </SelectItem>
                        <SelectItem
                          value={ModelModifiedType.LOSS_FUNCTION_TUNE}
                        >
                          損失函數調整
                        </SelectItem>
                        <SelectItem value={ModelModifiedType.OTHER}>
                          其他
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* 🔹描述 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={
                        isInitial
                          ? "此版本用於激活比較功能"
                          : "請輸入版本調整的說明，例如：參數優化提升精度"
                      }
                      disabled={isInitial} // 初始模式禁用，postComparison 允許編輯
                      onChange={(e) => {
                        field.onChange(e);
                        setDescriptionEdited(true); // 標記使用者手動編輯過
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🔹送出按鈕 */}
            <Button type="submit" className="w-full">
              建立新版本並開始設定參數
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
function getDescriptionSuggestion(
  modifiedType: VersionActivateFormValues["modifiedType"]
) {
  switch (modifiedType) {
    case "參數調整":
      return "根據比較結果，微調學習率、批次大小等超參數。";
    case "資料集擴增":
      return "擴充訓練資料集，以提升模型的泛化能力。";
    case "模型架構修改":
      return "修改模型架構以改善表現，例如新增層數或調整激活函數。";
    case "損失函數調整":
      return "調整損失函數以提升訓練穩定性或對目標任務更敏感。";
    case "其他":
      return "其他類型的優化或實驗性修改。";
    case "初始化版本":
    default:
      return "初始化版本，啟動比較流程。";
  }
}
