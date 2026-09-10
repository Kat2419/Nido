export function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateStr}T00:00:00Z`));
}

export function nextOccurrence(dateStr: string, isRecurring: boolean): Date {
  const original = new Date(`${dateStr}T00:00:00Z`);
  if (!isRecurring) return original;

  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  const next = new Date(
    Date.UTC(todayUTC.getUTCFullYear(), original.getUTCMonth(), original.getUTCDate())
  );
  if (next < todayUTC) {
    next.setUTCFullYear(next.getUTCFullYear() + 1);
  }
  return next;
}

export function formatDateParts(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00Z`);
  const opts = { timeZone: "UTC" } as const;
  return {
    weekday: new Intl.DateTimeFormat("es-CO", { weekday: "long", ...opts }).format(date),
    day: new Intl.DateTimeFormat("es-CO", { day: "2-digit", ...opts }).format(date),
    month: new Intl.DateTimeFormat("es-CO", { month: "long", ...opts }).format(date),
    year: new Intl.DateTimeFormat("es-CO", { year: "numeric", ...opts }).format(date),
  };
}

export function buildGoogleCalendarUrl({
  title,
  eventDate,
  eventTime,
  durationHours = 3,
  location,
}: {
  title: string;
  eventDate: string;
  eventTime: string | null;
  durationHours?: number;
  location?: string | null;
}): string {
  let hours = 0;
  let minutes = 0;
  const match = eventTime?.match(/(\d{1,2}):(\d{2})\s*(a\.?m\.?|p\.?m\.?)?/i);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const meridiem = match[3]?.toLowerCase().replace(/\./g, "");
    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;
  }

  const [year, month, day] = eventDate.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
  });
  if (location) params.set("location", location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function formatNameList(names: string[]): string {
  const cleaned = names.map((n) => n.trim()).filter(Boolean);
  if (cleaned.length === 0) return "";
  if (cleaned.length === 1) return cleaned[0];
  return `${cleaned.slice(0, -1).join(", ")} y ${cleaned[cleaned.length - 1]}`;
}

export function daysUntil(date: Date): number {
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const diff = date.getTime() - todayUTC.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}
