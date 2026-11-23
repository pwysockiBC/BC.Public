// Date formatting for the public forms, in US English.

// A calendar date from the API ("2027-01-27") → "Wednesday, January 27, 2027".
// Parsed as a local date, so it never shifts a day because of the time zone.
export function formatLongDate(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// A moment from the API (UTC, "2027-01-20T04:59:00Z") → "January 19, 2027 at 11:59 PM" in the visitor's time zone.
export function formatDateTime(moment: string) {
  return new Date(moment).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

// Today as "yyyy-mm-dd" in the visitor's time zone, for comparing with date inputs.
export function todayIso() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
}
