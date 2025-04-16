import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ActionCardVariant = "default" | "warning" | "error" | "success";

interface ActionCardProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  variant?: ActionCardVariant;
}

export function ActionCard({
  icon,
  label,
  onClick,
  disabled,
  className,
  iconClassName,
  variant = "default",
}: ActionCardProps) {
  const variantCardStyle: Record<ActionCardVariant, string> = {
    default: "hover:bg-muted",
    warning: "bg-yellow-50 hover:bg-yellow-100 border border-yellow-200",
    error: "bg-red-50 hover:bg-red-100 border border-red-200",
    success: "bg-green-50 hover:bg-green-100 border border-green-200",
  };
  const variantIconStyle: Record<ActionCardVariant, string> = {
    default: "bg-muted",
    warning: "bg-yellow-100",
    error: "bg-red-100",
    success: "bg-green-100",
  };
  return (
    <Card
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "group cursor-pointer transition border p-4 flex items-center gap-4 rounded-xl hover:shadow-md",
        disabled ? "opacity-50 cursor-not-allowed" : variantCardStyle[variant],
        className
      )}
    >
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full",
          variantIconStyle[variant],
          iconClassName
        )}
      >
        {icon}
      </div>
      <span className="text-sm font-medium text-foreground group-hover:underline">
        {label}
      </span>
    </Card>
  );
}
