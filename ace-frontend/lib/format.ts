export function formatDow(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" });
}

export function formatShortDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatFullDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(time: string) {
  const [h, m] = time.split(":");
  const hh = parseInt(h, 10);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${m} ${ampm}`;
}
