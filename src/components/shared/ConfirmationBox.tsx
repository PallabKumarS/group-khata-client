import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

type TPropConfirmationBox = {
  description?: string;
  title?: string;
  trigger: ReactNode | string;
  onConfirm: () => void;
};

export default function ConfirmationBox({
  description,
  title,
  trigger,
  onConfirm,
}: TPropConfirmationBox) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="" asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm rounded-2xl border-border/60 bg-card shadow-xl p-0 overflow-hidden">
        {/* Danger header band */}
        <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-destructive/20 shrink-0">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <AlertDialogHeader className="p-0 gap-0.5">
            <AlertDialogTitle className="text-base font-bold leading-tight">
              {title || "Are you sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-destructive/80">
              {description ||
                "This action cannot be undone. Your data will be permanently deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <AlertDialogFooter className="px-6 py-4 gap-2 flex-row justify-end">
          <AlertDialogCancel className="h-9 px-4 rounded-lg text-sm font-medium border-border/60 hover:bg-muted/60 bg-transparent">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="h-9 px-4 rounded-lg text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
