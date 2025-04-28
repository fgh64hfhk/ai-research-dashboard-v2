import {
  modelCreateSchema,
  ModelFormValues,
} from "@/schemas/modelCreateSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

interface ModelCreateFormProps {
  onSubmit: (values: ModelFormValues) => Promise<void>;
}

export function ModelCreateForm({ onSubmit }: ModelCreateFormProps) {
  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelCreateSchema),
    defaultValues: {
      modelName: "GPT-Finance-V2",
      language: "Python",
      description: "A large language model for financial data processing v2.",
    },
  });

  const handleSubmitWrapper = async (data: ModelFormValues) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        id="model-create-form"
        onSubmit={form.handleSubmit(handleSubmitWrapper, (error) => console.warn(error))}
        className="space-y-6"
      >
        {/* 模型名稱 */}
        <FormField
          control={form.control}
          name="modelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>模型名稱</FormLabel>
              <FormControl>
                <Input placeholder="請輸入模型名稱" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 語言選擇 */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>語言</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇語言" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="C++">C++</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 模型描述 */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>模型描述（選填）</FormLabel>
              <FormControl>
                <Input placeholder="簡要描述該模型的用途..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
