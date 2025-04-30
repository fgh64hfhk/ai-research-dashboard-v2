"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  scheduleSchema,
  ScheduleFormValues,
} from "@/schemas/scheduleCreateSchema";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleCreateFormProps {
  onSubmit: (values: ScheduleFormValues) => void;
}

export const ScheduleCreateForm = ({ onSubmit }: ScheduleCreateFormProps) => {
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      runDate: new Date(),
      type: "auto",
      triggerTraining: true,
    },
  });
  return (
    <Form {...form}>
      <form
        id="schedule-create-form"
        onSubmit={form.handleSubmit(onSubmit, (error) => console.warn(error))}
        className="space-y-6"
      >
        {/* 執行時間（DatePicker） */}
        <FormField
          control={form.control}
          name="runDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>執行時間</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy-MM-dd HH:mm")
                      ) : (
                        <span>請選擇時間</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[1000]" side="bottom">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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
      </form>
    </Form>
  );
};
