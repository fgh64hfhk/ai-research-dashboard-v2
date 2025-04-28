import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const InfoRow = ({
  label,
  value,
  icon,
  tooltip,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  tooltip?: string;
}) => (
  <div className="flex flex-col gap-1 border-b pb-3">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {icon && <span className="text-base text-primary">{icon}</span>}
      {tooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help underline decoration-dotted underline-offset-2">
                {label}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span>{label}</span>
      )}
    </div>
    <div className="text-base break-all leading-snug text-zinc-900 dark:text-zinc-100">
      {value}
    </div>
  </div>
);
