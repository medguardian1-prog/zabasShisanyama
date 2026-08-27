import type { OpeningHoursRow } from "@/lib/types";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function dayName(dayOfWeek: number): string {
  return DAY_NAMES[dayOfWeek] ?? "";
}

/** "18:30:00" | "18:30" → "18:30" for display */
export function formatTime(t: string | null): string {
  if (!t) return "";
  return t.slice(0, 5);
}

/** Current date/time in Africa/Johannesburg (SAST, UTC+2) — never server local time. */
function nowInJohannesburg(): { dayOfWeek: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-ZA", {
    timeZone: "Africa/Johannesburg",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const weekdayIndex: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const dayOfWeek = weekdayIndex[get("weekday").slice(0, 3)] ?? 0;
  const hour = parseInt(get("hour"), 10) % 24;
  const minute = parseInt(get("minute"), 10);
  return { dayOfWeek, minutes: hour * 60 + minute };
}

function toMinutes(t: string | null): number | null {
  if (!t) return null;
  const [h, m] = t.split(":").map((n) => parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

export interface OpenStatus {
  open: boolean;
  label: string;
  note: string | null;
}

/**
 * Computes "Open now · Closes 22:00" / "Closed today" from opening_hours,
 * respecting the closed flag and note. Handles closing times past midnight
 * (closes < opens = spills into the next day).
 */
export function getOpenStatus(rows: OpeningHoursRow[]): OpenStatus | null {
  if (!rows.length) return null;
  const { dayOfWeek, minutes } = nowInJohannesburg();

  const today = rows.find((r) => r.dayOfWeek === dayOfWeek);
  const yesterday = rows.find(
    (r) => r.dayOfWeek === (dayOfWeek + 6) % 7
  );

  // still open from yesterday's late close (e.g. 18:00 – 02:00)
  if (yesterday && !yesterday.closed) {
    const opens = toMinutes(yesterday.opens);
    const closes = toMinutes(yesterday.closes);
    if (
      opens !== null &&
      closes !== null &&
      closes < opens &&
      minutes < closes
    ) {
      return {
        open: true,
        label: `Open now · Closes ${formatTime(yesterday.closes)}`,
        note: yesterday.note,
      };
    }
  }

  if (!today || today.closed) {
    return { open: false, label: "Closed today", note: today?.note ?? null };
  }

  const opens = toMinutes(today.opens);
  const closes = toMinutes(today.closes);
  if (opens === null || closes === null) {
    return { open: false, label: "Closed today", note: today.note };
  }

  const closesLate = closes < opens; // past midnight
  if (minutes >= opens && (closesLate || minutes < closes)) {
    return {
      open: true,
      label: `Open now · Closes ${formatTime(today.closes)}`,
      note: today.note,
    };
  }
  if (minutes < opens) {
    return {
      open: false,
      label: `Closed · Opens ${formatTime(today.opens)}`,
      note: today.note,
    };
  }
  return { open: false, label: "Closed now", note: today.note };
}
