/** Builds a wa.me deep link from site_settings.whatsapp. Renders nothing when unset. */
export default function WhatsAppButton({
  number,
  message = "Hi Zaba's! I'd like to make a booking.",
  label = "WhatsApp Us",
  className,
}: {
  number: string | null | undefined;
  message?: string;
  label?: string;
  className?: string;
}) {
  if (!number || number === "TODO") return null;
  const digits = number.replace(/[^\d]/g, "");
  if (!digits) return null;
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
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
