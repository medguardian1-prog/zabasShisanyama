import { cn } from "@/lib/utils";
import Eyebrow from "@/components/Eyebrow";

export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 sm:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      <Eyebrow data-reveal className="mb-4">
        {eyebrow}
      </Eyebrow>
      <div className="overflow-hidden">
        <h2
          data-mask
          className="display-xl text-[2.75rem] sm:text-5xl lg:text-[3.75rem]"
        >
          {title}
        </h2>
      </div>
    </div>
  );
}
