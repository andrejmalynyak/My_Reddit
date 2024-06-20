import * as React from "react";

import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/lib/use-auto-resize-textarea";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, ...props }, ref) => {
    const { textAreaRef } = useAutoResizeTextarea(ref, autoResize);

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground placeholder:whitespace-nowrap placeholder:text-ellipsis focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={textAreaRef}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
