import { cn } from "@/lib/utils";

export default function Eyebrow({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("eyebrow", className)} {...rest}>
      {children}
    </p>
  );
}
