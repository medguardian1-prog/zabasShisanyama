import { cn } from "@/lib/utils";

type Tone = "char" | "smoke" | "slate" | "ember";

const tones: Record<Tone, string> = {
  char: "bg-char text-bone",
  smoke: "bg-smoke text-bone",
  slate: "bg-slate text-bone",
  ember: "bg-ember text-bone",
};

export default function Section({
  tone = "char",
  className,
  children,
  id,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    // Phones get a tighter rhythm. At py-20 two stacked sections put 160px of
    // empty ground between them — a fifth of a phone viewport, and the tones
    // either side differ by a few points of luminance, so the gap reads as a
    // dead scroll rather than as separation. sm and up are unchanged.
    <section id={id} className={cn("py-14 sm:py-28", tones[tone], className)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">{children}</div>
    </section>
  );
}
