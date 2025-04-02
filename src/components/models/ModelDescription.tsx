// components/model/ModelDescription.tsx
interface Props {
  description?: string;
}

export function ModelDescription({ description }: Props) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-1">模型描述</h2>
      <p className="text-sm text-muted-foreground whitespace-pre-line">
        {description || "尚未提供描述。"}
      </p>
    </div>
  );
}
