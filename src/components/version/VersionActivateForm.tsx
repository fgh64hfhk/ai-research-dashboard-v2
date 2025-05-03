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
  versionActivateSchema,
  VersionActivateFormValues,
} from "@/schemas/versionActivateSchema";

interface VersionActivateFormProps {
  modelId: string;
  defaultValues: VersionActivateFormValues;
  onSubmit: (formData: VersionActivateFormValues) => void;
}

export function VersionActivateForm({
  modelId,
  defaultValues,
  onSubmit,
}: VersionActivateFormProps) {
  const form = useForm<VersionActivateFormValues>({
    resolver: zodResolver(versionActivateSchema),
    defaultValues: {
      ...defaultValues,
      modelId, // 強制覆蓋 modelId 以防外部傳錯
    },
  });

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

            {/* 🔹修改類型（不可編輯） */}
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

            {/* 🔹描述（不可編輯） */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
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
