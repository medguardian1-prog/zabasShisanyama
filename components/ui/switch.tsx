"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-8 w-14 shrink-0 cursor-pointer rounded-full border border-hair bg-char transition-colors data-[state=checked]:border-ember data-[state=checked]:bg-ember",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="block h-6 w-6 translate-x-1 rounded-full bg-ash transition-transform data-[state=checked]:translate-x-7 data-[state=checked]:bg-bone" />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";
