import Link from "next/link";
import Image from "next/image";
import { getOpeningHours, getSiteSettings } from "@/lib/queries";
import { dayName, formatTime } from "@/lib/hours";

function isTodo(v: string | null | undefined): boolean {
  return !v || v === "TODO";
}

export default async function SiteFooter() {
  const [settings, hours] = await Promise.all([
    getSiteSettings(),
    getOpeningHours(),
  ]);

  const socials = [
    { label: "Instagram", href: settings?.instagram },
    { label: "Facebook", href: settings?.facebook },
    { label: "TikTok", href: settings?.tiktok },
  ].filter((s) => !isTodo(s.href));

  return (
    <footer className="border-t border-hair bg-smoke text-bone">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="Zaba's Shisanyama logo"
                width={56}
                height={56}
                sizes="56px"
                className="h-14 w-14 object-cover"
              />
              <span className="font-display text-xl uppercase">
                Zaba&rsquo;s Shisanyama
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ash">
              Flame-grilled meat, cold drinks and good people. Real fire, real
              flavour.
            </p>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-6">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.75rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-flame"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="eyebrow mb-5">Hours</p>
            {hours.length ? (
              <ul className="space-y-2 text-sm">
                {hours.map((h) => (
                  <li
                    key={h.id}
                    className="flex justify-between gap-6 text-ash"
                  >
                    <span>{dayName(h.dayOfWeek)}</span>
                    <span className="text-bone">
                      {h.closed
                        ? "Closed"
                        : `${formatTime(h.opens)} – ${formatTime(h.closes)}`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ash">
                Opening hours coming soon — call ahead.
              </p>
            )}
          </div>

          <div>
            <p className="eyebrow mb-5">Find Us</p>
            <ul className="space-y-3 text-sm text-ash">
              <li>{isTodo(settings?.address) ? "Address: TODO" : settings!.address}</li>
              <li>
                {isTodo(settings?.phone) ? (
                  "Phone: TODO"
                ) : (
                  <a
                    href={`tel:${settings!.phone}`}
                    className="transition-colors hover:text-flame"
                  >
                    {settings!.phone}
                  </a>
                )}
              </li>
              {!isTodo(settings?.mapLink) && (
                <li>
                  <a
                    href={settings!.mapLink!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bone underline decoration-gold underline-offset-4 transition-colors hover:text-flame"
                  >
                    Open in Maps
                  </a>
                </li>
              )}
            </ul>
            <Link
              href="/contact"
              className="mt-6 inline-block bg-ember px-6 py-3 text-[0.75rem] uppercase tracking-[0.18em] text-bone transition-colors hover:bg-flame"
            >
              Book a Table
            </Link>
          </div>
        </div>

        <div className="rule mt-14" />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.6875rem] text-ash">
            © {new Date().getFullYear()} Zaba&rsquo;s Shisanyama. All rights
            reserved.
          </p>
          <Link
            href="/admin"
            className="text-[0.6875rem] text-ash transition-colors hover:text-bone"
          >
            Staff
          </Link>
        </div>
      </div>
    </footer>
  );
}
