import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  solid: "bg-ember text-bone hover:bg-flame",
  outline: "border border-bone text-bone hover:border-flame hover:text-flame",
  ghost: "text-ash hover:text-bone",
  danger: "bg-transparent border border-ember text-ember hover:bg-ember hover:text-bone",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.6875rem]",
  md: "px-6 py-3 text-[0.75rem]",
  lg: "px-8 py-4 text-[0.8125rem]",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 uppercase tracking-[0.18em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
