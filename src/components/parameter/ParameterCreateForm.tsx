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
import { Button } from "@/components/ui/button";

import {
  parameterCreateSchema,
  ParameterFormValues,
} from "@/schemas/parameterCreateSchema";
import { useEffect } from "react";

interface Props {
  defaultValues?: Partial<ParameterFormValues>;
  onSubmit: (values: ParameterFormValues) => void;
}

export function ParameterCreateForm({ defaultValues, onSubmit }: Props) {
  const form = useForm<ParameterFormValues>({
    resolver: zodResolver(parameterCreateSchema),
    defaultValues: {
      learningRate: 0.001,
      batchSize: 32,
      epochs: 10,
      optimizer: "adam",
      lossFunction: "categorical_crossentropy",
      datasetVersion: "v1",
      pretrainedModel: false,
      augmentation: false,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) form.reset({ ...form.getValues(), ...defaultValues });
  }, [defaultValues, form]);

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
          <FormField
            control={form.control}
            name="learningRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Learning Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="0.0001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="batchSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Size</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="epochs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Epochs</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
          <FormField
            control={form.control}
            name="optimizer"
            render={({ field }) => (
              <FormItem>
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
          <FormField
            control={form.control}
            name="lossFunction"
            render={({ field }) => (
              <FormItem>
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
          <FormField
            control={form.control}
            name="datasetVersion"
            render={({ field }) => (
              <FormItem>
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
          <FormField
            control={form.control}
            name="pretrainedModel"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between space-y-0">
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
          <FormField
            control={form.control}
            name="augmentation"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between space-y-0">
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

        <div className="pt-4 flex justify-end">
          <Button type="button" variant="ghost" onClick={() => form.reset()}>
            重設表單
          </Button>
        </div>
      </form>
    </Form>
  );
}
