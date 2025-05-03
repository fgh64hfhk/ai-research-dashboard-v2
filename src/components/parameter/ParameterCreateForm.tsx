"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  parameterCreateSchema,
  ParameterFormValues,
} from "@/schemas/parameterCreateSchema";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

export interface ParameterCreateFormRef {
  resetForm: () => void;
  clearHighlightAndClearForm: () => void;
}

interface Props {
  /** 初始預填資料，可從引導流程或上次設定帶入 */
  defaultValues?: Partial<ParameterFormValues>;
  /** 表單送出時呼叫 */
  onSubmit: (values: ParameterFormValues) => void;
}

const DEFAULT_PARAMS: Partial<ParameterFormValues> = {
  learningRate: 0.001,
  batchSize: 32,
  epochs: 10,
  optimizer: "adam",
  lossFunction: "categorical_crossentropy",
  datasetVersion: "Chinese-MedQA-v1",
  pretrainedModel: false,
  augmentation: false,
};

export const ParameterCreateForm = forwardRef<ParameterCreateFormRef, Props>(
  ({ defaultValues, onSubmit }, ref) => {
    // 定義 highlightFields 狀態
    const [highlightFields, setHighlightFields] = useState<string[]>([]);
    const [hasInitialized, setHasInitialized] = useState(false);

    const form = useForm<ParameterFormValues>({
      resolver: zodResolver(parameterCreateSchema),
      defaultValues: {
        ...DEFAULT_PARAMS,
        ...defaultValues,
      },
    });

    // 偵測 defaultValues，設定高亮欄位
    useEffect(() => {
      if (!hasInitialized && defaultValues) {
        form.reset(
          {
            ...form.getValues(), // 使用目前已經載入的值
            ...defaultValues, // 再覆蓋新的預填資料
          },
          {
            keepErrors: false,
          }
        );
        // 比對哪些欄位有變動
        const changedKeys = Object.keys(defaultValues).filter((key) => {
          return (
            defaultValues[key as keyof ParameterFormValues] !==
            DEFAULT_PARAMS[key as keyof ParameterFormValues]
          );
        });

        setHighlightFields(changedKeys);
        setHasInitialized(true);
      }
    }, [defaultValues, hasInitialized, form]);

    useImperativeHandle(ref, () => ({
      resetForm() {
        form.reset();
        setHighlightFields([]);
      },
      clearHighlightAndClearForm() {
        form.reset({});
        setHighlightFields([]);
      },
    }));

    return (
      <Form {...form}>
        <form
          id="parameter-create-form"
          onSubmit={form.handleSubmit(onSubmit, (error) => console.log(error))}
          className="space-y-6"
        >
          {/* 訓練設定 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              訓練設定
            </h3>
            {/* Learning Rate */}
            <FormField
              control={form.control}
              name="learningRate"
              render={({ field }) => (
                <FormItem
                  className={
                    highlightFields.includes("learningRate")
                      ? "bg-yellow-50 rounded-md p-2"
                      : ""
                  }
                >
                  <FormLabel>Learning Rate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0001"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Batch Size */}
            <FormField
              control={form.control}
              name="batchSize"
              render={({ field }) => (
                <FormItem
                  className={
                    highlightFields.includes("batchSize")
                      ? "bg-yellow-50 rounded-md p-2"
                      : ""
                  }
                >
                  <FormLabel>Batch Size</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Epochs */}
            <FormField
              control={form.control}
              name="epochs"
              render={({ field }) => (
                <FormItem
                  className={
                    highlightFields.includes("epochs")
                      ? "bg-yellow-50 rounded-md p-2"
                      : ""
                  }
                >
                  <FormLabel>Epochs</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 優化器設定 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              優化器設定
            </h3>
            {/* Optimizer */}
            <FormField
              control={form.control}
              name="optimizer"
              render={({ field }) => (
                <FormItem
                  className={
                    highlightFields.includes("optimizer")
                      ? "bg-yellow-50 rounded-md p-2"
                      : ""
                  }
                >
                  <FormLabel>Optimizer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇優化器" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="adam">Adam</SelectItem>
                      <SelectItem value="sgd">SGD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Loss Function */}
            <FormField
              control={form.control}
              name="lossFunction"
              render={({ field }) => (
                <FormItem
                  className={
                    highlightFields.includes("lossFunction")
                      ? "bg-yellow-50 rounded-md p-2"
                      : ""
                  }
                >
                  <FormLabel>Loss Function</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="例如：categorical_crossentropy"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 資料設定 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              資料設定
            </h3>
            {/* Dataset Version */}
            <FormField
              control={form.control}
              name="datasetVersion"
              render={({ field }) => (
                <FormItem
                  className={
                    highlightFields.includes("datasetVersion")
                      ? "bg-yellow-50 rounded-md p-2"
                      : ""
                  }
                >
                  <FormLabel>資料集版本</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="例如：v1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 模型初始化 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              模型初始化
            </h3>
            {/* Pretrained Model */}
            <FormField
              control={form.control}
              name="pretrainedModel"
              render={({ field }) => (
                <FormItem
                  className={
                    highlightFields.includes("pretrainedModel")
                      ? "bg-yellow-50 rounded-md p-2 flex items-center justify-between space-y-0"
                      : "flex items-center justify-between space-y-0"
                  }
                >
                  <FormLabel>使用預訓練模型</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* 其他參數 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              其他參數
            </h3>
            {/* Augmentation */}
            <FormField
              control={form.control}
              name="augmentation"
              render={({ field }) => (
                <FormItem
                  className={
                    highlightFields.includes("augmentation")
                      ? "bg-yellow-50 rounded-md p-2 flex items-center justify-between space-y-0"
                      : "flex items-center justify-between space-y-0"
                  }
                >
                  <FormLabel>資料增強</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    );
  }
);

ParameterCreateForm.displayName = "ParameterCreateForm";
