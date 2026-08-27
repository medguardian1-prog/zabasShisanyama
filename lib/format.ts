/** Prices are integers in cents throughout; format only at the edge. */
export function formatPrice(cents: number | null): string {
  if (cents === null || cents === undefined) return "Ask at the counter";
  const rand = cents / 100;
  return Number.isInteger(rand) ? `R${rand}` : `R${rand.toFixed(2)}`;
}

export function formatEventDate(iso: string | null): string {
  if (!iso) return "Date to be announced";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Date to be announced";
  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Johannesburg",
  }).format(d);
}
