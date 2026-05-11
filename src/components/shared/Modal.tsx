import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

type TModalProps = {
  title: string;
  trigger: ReactNode;
  content: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Modal({
  title,
  trigger,
  content,
  open,
  onOpenChange,
}: TModalProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
        asChild
      >
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-4rem)] overflow-y-auto bg-card rounded-2xl border-border/60 shadow-xl w-3/4 min-w-72 max-w-2xl p-0">
        {/* Modal Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/60 bg-muted/20">
          <DialogTitle className="text-base font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {title} form
          </DialogDescription>
        </DialogHeader>
        {/* Modal Body */}
        <div className="px-6 py-5">{content}</div>
      </DialogContent>
    </Dialog>
  );
}
