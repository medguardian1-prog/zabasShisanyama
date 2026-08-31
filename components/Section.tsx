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
    <section id={id} className={cn("py-20 sm:py-28", tones[tone], className)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">{children}</div>
    </section>
  );
}
