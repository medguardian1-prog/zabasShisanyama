import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full border border-hair bg-char px-4 py-3.5 text-base text-bone placeholder:text-ash/60 focus:border-ember focus:outline-none",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
