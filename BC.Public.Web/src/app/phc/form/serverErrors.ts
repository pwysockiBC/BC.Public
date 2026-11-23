// Where the API's 400 error keys go on the form. Most keys are already the form's field paths
// (e.g. "email", "participation.donationDetails"); a few are renamed, and the rest aren't about
// one field ("form", "projectId", "agreementsVersion", ...), so they're shown above the button.

// API key → form path, where they differ.
const renamed: Record<string, string> = {
  participation: "participation.root",
}

// Form paths that show their own error message.
const fieldPaths = new Set([
  "firstName", "lastName", "dateOfBirth", "addressLine", "city", "state", "zipCode", "phone", "email",
  "affiliationName", "affiliationAddressLine", "affiliationCity", "affiliationState", "affiliationZipCode",
  "affiliationPhone", "affiliationPhoneExt", "affiliationEmail",
  "participation.root", "participation.shifts", "participation.donationDetails",
  "participation.resourceTableSummary", "participation.directServiceDetails",
  "streetTeamRegionIds", "spokenLanguageIds",
])

export type SortedErrors = {
  // Form path → its first message.
  fields: { path: string; message: string }[]
  // Messages not tied to a field.
  general: string[]
}

export function sortServerErrors(errors: Record<string, string[]>): SortedErrors {
  const sorted: SortedErrors = { fields: [], general: [] }
  for (const [key, messages] of Object.entries(errors)) {
    const path = renamed[key] ?? key
    if (fieldPaths.has(path) && messages.length > 0) {
      sorted.fields.push({ path, message: messages[0] })
    } else {
      sorted.general.push(...messages)
    }
  }
  return sorted
}
