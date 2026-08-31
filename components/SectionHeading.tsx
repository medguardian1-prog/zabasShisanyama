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
      {/* Display leading is 0.95, so glyphs overflow the line box and the mask
          shears descenders. The room has to sit on the heading itself —
          padding on the clipping parent would reveal the hidden state. */}
      <div className="overflow-hidden">
        <h2
          data-mask
          className="display-xl pb-2 text-[2.75rem] sm:pb-3 sm:text-5xl lg:text-[3.75rem]"
        >
          {title}
        </h2>
      </div>
    </div>
  );
}
