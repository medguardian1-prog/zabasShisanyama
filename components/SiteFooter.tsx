import Link from "next/link";
import Image from "next/image";
import { getOpeningHours, getSiteSettings } from "@/lib/queries";
import { dayName, formatTime, withDefaultHours } from "@/lib/hours";
import SocialLinks from "@/components/SocialLinks";
import {
  DEFAULT_ADDRESS,
  DEFAULT_FACEBOOK,
  DEFAULT_INSTAGRAM,
  DEFAULT_MAP_LINK,
  DEFAULT_PHONE,
  DEFAULT_TIKTOK,
  WA_BOOKING_DEFAULT,
  waLink,
  withDefault,
} from "@/lib/site-defaults";

export default async function SiteFooter() {
  const [settings, dbHours] = await Promise.all([
    getSiteSettings(),
    getOpeningHours(),
  ]);
  const hours = withDefaultHours(dbHours);

  const socials = [
    {
      platform: "instagram" as const,
      href: withDefault(settings?.instagram, DEFAULT_INSTAGRAM),
    },
    {
      platform: "facebook" as const,
      href: withDefault(settings?.facebook, DEFAULT_FACEBOOK),
    },
    {
      platform: "tiktok" as const,
      href: withDefault(settings?.tiktok, DEFAULT_TIKTOK),
    },
  ];

  const address = withDefault(settings?.address, DEFAULT_ADDRESS);
  const phone = withDefault(settings?.phone, DEFAULT_PHONE);
  const mapLink = withDefault(settings?.mapLink, DEFAULT_MAP_LINK);

  return (
    <footer className="border-t border-hair bg-smoke text-bone">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        {/* Decorative oversized wordmark. Rendered as SVG so it stays a
            graphic rather than page text. */}
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 1000 100"
          className="pointer-events-none mb-14 w-full select-none"
        >
          <text
            x="0"
            y="78"
            className="font-display"
            fontSize="96"
            letterSpacing="1"
            fill="var(--color-bone)"
            fillOpacity="0.07"
            style={{ textTransform: "uppercase" }}
          >
            ZABA&rsquo;S SHISANYAMA
          </text>
        </svg>
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
            <SocialLinks links={socials} className="mt-6" />
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
              <li>{address}</li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="tap-target transition-colors hover:text-flame"
                >
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target text-bone underline decoration-gold underline-offset-4 transition-colors hover:text-flame"
                >
                  Open in Maps
                </a>
              </li>
            </ul>
            <a
              href={waLink(WA_BOOKING_DEFAULT, settings?.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-ember px-6 py-3 text-[0.75rem] uppercase tracking-[0.18em] text-bone transition-colors hover:bg-flame"
            >
              Book on WhatsApp
            </a>
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
            className="tap-target text-[0.6875rem] text-ash transition-colors hover:text-bone"
          >
            Staff
          </Link>
        </div>
      </div>
    </footer>
  );
}
