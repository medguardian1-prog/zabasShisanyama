import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Native select, restyled. Native pickers beat custom popovers on the phones
 * the staff actually use.
 */
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full appearance-none border border-hair bg-char bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%3E%3Cpath%20d%3D%22M1%201l5%205%205-5%22%20stroke%3D%22%23a39a90%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-no-repeat px-4 py-3.5 pr-10 text-base text-bone focus:border-ember focus:outline-none",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
