import { waLink, WA_BOOKING_DEFAULT } from "@/lib/site-defaults";

/** WhatsApp deep link. Uses site_settings.whatsapp when set, else the client's number. */
export default function WhatsAppButton({
  number,
  message = WA_BOOKING_DEFAULT,
  label = "WhatsApp Us",
  className,
}: {
  number?: string | null | undefined;
  message?: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={waLink(message, number)}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "inline-block border border-bone px-8 py-4 text-[0.8125rem] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:border-flame hover:text-flame"
      }
    >
      {label}
    </a>
  );
}
