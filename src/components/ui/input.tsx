import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // text-base (16px) en mobile evita el zoom automatico de iOS Safari
          // text-sm en sm+ para densidad en desktop
          "flex h-12 w-full rounded-2xl border border-ink-800 bg-white px-4 text-base sm:text-sm text-foreground placeholder:text-ink-500 transition-colors",
          "focus:outline-none focus:border-lime focus:ring-2 focus:ring-lime/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
