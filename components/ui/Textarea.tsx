import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[110px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100",
        className
      )}
      {...props}
    />
  );
});
