import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "info";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      title,
      description,
      action,
      variant = "default",
      open: controlledOpen,
      onOpenChange,
      duration = 3000,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(controlledOpen ?? true);
    const isControlled = controlledOpen !== undefined;

    React.useEffect(() => {
      if (isControlled) {
        setOpen(controlledOpen);
      }
    }, [controlledOpen, isControlled]);

    React.useEffect(() => {
      if (open && duration > 0) {
        const timer = setTimeout(() => {
          if (isControlled && onOpenChange) {
            onOpenChange(false);
          } else {
            setOpen(false);
          }
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [open, duration, isControlled, onOpenChange]);

    const handleClose = () => {
      if (isControlled && onOpenChange) {
        onOpenChange(false);
      } else {
        setOpen(false);
      }
    };

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "fixed top-4 right-4 z-50 max-w-md rounded-lg shadow-lg p-4 flex items-start gap-4 transition-all transform translate-x-0",
          variant === "default" && "bg-background border border-muted",
          variant === "success" && "bg-primary/10 border border-primary",
          variant === "error" && "bg-destructive/10 border border-destructive",
          variant === "warning" && "bg-gold/10 border border-gold",
          variant === "info" && "bg-blue/10 border border-blue",
          className
        )}
        {...props}
      >
        <div className="flex-1">
          {title && (
            <div
              className={cn(
                "font-medium text-foreground",
                variant === "success" && "text-primary",
                variant === "error" && "text-destructive",
                variant === "warning" && "text-gold",
                variant === "info" && "text-blue"
              )}
            >
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm text-muted-foreground mt-1">
              {description}
            </div>
          )}
        </div>
        {action && <div className="flex-none">{action}</div>}
        <button
          className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-full"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    );
  }
);

Toast.displayName = "Toast";

export { Toast };
