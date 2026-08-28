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
      // tap-target extends the hit area to 44px on touch without changing layout
      "tap-target relative h-9 w-16 shrink-0 cursor-pointer rounded-full border border-hair bg-char transition-colors data-[state=checked]:border-ember data-[state=checked]:bg-ember",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="block h-7 w-7 translate-x-1 rounded-full bg-ash transition-transform data-[state=checked]:translate-x-8 data-[state=checked]:bg-bone" />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";
