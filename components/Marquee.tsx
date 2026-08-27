const WORDS = ["Shisanyama", "Flame-Grilled", "Cold Drinks", "Good People", "Real Fire"];

/** Scrolling ticker strip — pure CSS, pauses under reduced motion. */
export default function Marquee() {
  const run = [...WORDS, ...WORDS];
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-hair bg-char py-5"
    >
      <div className="marquee-track">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {run.map((w, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className="font-display text-xl uppercase tracking-[0.06em] text-bone/25 sm:text-2xl">
                  {w}
                </span>
                <span className="mx-6 text-gold/60">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
