"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { scheduleSchema, ScheduleFormValues } from "@/schemas/scheduleSchema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { CalendarIcon } from "lucide-react";

import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 定義組件的導入參數
interface AddScheduleFormUIProps {
  onSubmit?: (values: ScheduleFormValues) => void;
}

export const AddScheduleFormUI = ({ onSubmit }: AddScheduleFormUIProps) => {
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      modelId: "Model_Test",
      version: "v1.0",
      buildDate: "",
      runDate: "",
      triggerTraining: false,
    },
  });
  return (
    <Form {...form}>
      <form
        id="schedule-form" // 讓外部 button 可以綁定這個表單
        onSubmit={form.handleSubmit(onSubmit || (() => {}))}
        className="space-y-6"
      >
        {/* 模型 ID */}
        <FormField
          control={form.control}
          name="modelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>模型 ID</FormLabel>
              <FormControl>
                <Input placeholder="請輸入模型 ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 模型版本 */}
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>模型版本</FormLabel>
              <FormControl>
                <Input placeholder="請輸入版本號，例如 v1.0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 建構日期（DatePicker） */}
        <FormField
          control={form.control}
          name="buildDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>建構日期</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? field.value : <span>選擇日期</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      const formatted = date ? format(date, "yyyy-MM-dd") : "";
                      field.onChange(formatted);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 執行時間（DatePicker） */}
        <FormField
          control={form.control}
          name="runDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>排程執行時間</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(new Date(field.value), "yyyy-MM-dd HH:mm")
                      ) : (
                        <span>選擇時間</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      const iso = date ? new Date(date).toISOString() : "";
                      field.onChange(iso);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
