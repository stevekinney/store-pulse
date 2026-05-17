export function formatCurrencyFromCents(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return dateFormatter.format(date);
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function formatRelative(
  date: Date | null | undefined,
  now: Date = new Date(),
): string {
  if (!date) return "No due date";
  const diffMs = date.getTime() - now.getTime();
  const days = Math.round(diffMs / DAY_MS);
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days === -1) return "1 day overdue";
  if (days > 1) return `Due in ${days} days`;
  return `${Math.abs(days)} days overdue`;
}
