import { cn } from "@/lib/utils";

type Variant = "default" | "ember" | "gold" | "muted";

const variants: Record<Variant, string> = {
  default: "border border-hair text-ash",
  ember: "bg-ember text-bone",
  gold: "border border-gold text-gold",
  muted: "bg-hair text-ash",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.14em]",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
