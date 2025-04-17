"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import {
  versionCreateSchema,
  VersionFormValues,
} from "@/schemas/versionCreateSchema";

import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import FileDropzone from "@/components/common/FileDropzone";

interface VersionCreateFormProps {
  modelId: string;
  onSubmit: (formData: VersionFormValues) => void;
  onDone?: () => void; // 可選：送出後額外觸發操作（例如關閉 Dialog）
}

export function VersionCreateForm({
  modelId,
  onSubmit,
}: VersionCreateFormProps) {

  const form = useForm<VersionFormValues>({
    resolver: zodResolver(versionCreateSchema),
    defaultValues: {
      modelId,
      version: "v1.0",
      modifiedType: "初始版本上傳",
      modelFile: undefined,
    },
  });

  return (
    <Form {...form}>
      <form
        id="version-create-form"
        onSubmit={form.handleSubmit(onSubmit, (error) => {console.warn(error)})}
        className="space-y-6"
      >
        {/* ✅ 版本號 */}
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>版本號</FormLabel>
              <FormControl>
                <Input placeholder="v1.0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ 修改摘要 */}
        <FormField
          control={form.control}
          name="modifiedType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>修改摘要</FormLabel>
              <FormControl>
                <Input placeholder="初始版本上傳" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ 上傳檔案 */}
        <FormField
          control={form.control}
          name="modelFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>模型檔案（.h5）</FormLabel>
              <FileDropzone
                selectedFile={field.value}
                onFileSelect={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
