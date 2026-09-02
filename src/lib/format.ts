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

export function daysUntil(date: Date): number {
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const diff = date.getTime() - todayUTC.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}
