"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const BaseDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: BaseDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="pt-2 space-y-4">{children}</div>

        {footer && (
          <DialogFooter className="pt-4 border-t">{footer}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
