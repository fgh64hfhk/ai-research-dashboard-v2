// components/schedule/ScheduleCreateForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { format } from "date-fns";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { useModelList } from "@/hooks/model/model.hooks";
import { useVersionsByModelId } from "@/hooks/version/version.hooks";

import { CalendarIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { getScheduleKey } from "@/hooks/schedule/schedule.hooks";

import { ScheduleFormData } from "@/types/form";
import { transformToSchedulePayload } from "@/lib/utils/transformToSchedulePayload";

import { v4 as uuidv4 } from "uuid";
import { TrainingSchedule } from "@/types/schedule";
import { useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  modelId: z.string().min(1, "請選擇模型"),
  version: z.string().min(1, "請選擇版本"),
  runDate: z.date({ required_error: "請選擇執行日期" }),
  type: z.enum(["manual", "auto", "recurring"], {
    required_error: "請選擇排程類型",
  }),
});

export function ScheduleCreateForm() {
  const models = useModelList();
  const router = useRouter();
  const { dispatch } = useScheduleContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelId: "m001",
      version: "v1.0",
      runDate: undefined,
      type: "manual",
    },
  });

  const { handleSubmit, control, watch, setValue } = form;

  const selectedModelId = watch("modelId");
  const versions = useVersionsByModelId(selectedModelId);

  function onSubmit(values: ScheduleFormData) {
    setIsSubmitting(true);

    const payload = transformToSchedulePayload(values);

    const schedule = {
      id: uuidv4(),
      ...payload,
    };

    const key = getScheduleKey(schedule.modelId, schedule.version);
    console.log("key:", key);

    dispatch({
      type: "ADD_SCHEDULE",
      payload: schedule as TrainingSchedule,
    });

    toast.success("已成功建立訓練排程！");
    // router.push(`/models/${schedule.modelId}/version/${schedule.version}`);
    router.push(`/debug/schedule`);
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={control}
          name="modelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>選擇模型</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("version", ""); // 重設版本欄位
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇模型" />
                  </SelectTrigger>

                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.modelId} value={model.modelId}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>選擇模型版本</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedModelId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇板本" />
                  </SelectTrigger>
                  <SelectContent>
                    {versions.map((version) => (
                      <SelectItem key={version.version} value={version.version}>
                        {version.version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="runDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>執行時間</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      value="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy-MM-dd HH:mm")
                      ) : (
                        <span>請選擇執行時間</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>排程類型</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇排程類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">手動</SelectItem>
                    <SelectItem value="auto">自動</SelectItem>
                    <SelectItem value="recurring">週期性</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "提交中..." : "建立排程"}
        </Button>
      </form>
    </Form>
  );
}
