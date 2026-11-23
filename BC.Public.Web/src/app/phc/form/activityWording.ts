// What the form says for each way to help, from the draft wording program staff are reviewing
// (project doc claude/phc-form-wording.md). The keys are the request's participation fields.

export type ActivityField =
  | "pitSurvey" | "streetTeam" | "eventAssist" | "reportLocations" | "shareFlyer"
  | "donate" | "resourceTable" | "distributionInfo" | "directService"

export type ActivityWording = {
  field: ActivityField
  label: string
}

export const activities: ActivityWording[] = [
  {
    field: "pitSurvey",
    label: "Give the Point-In-Time (PIT) survey on site at the event to people experiencing homelessness.",
  },
  {
    field: "streetTeam",
    label: "Join the PIT Street Team, surveying places where people experiencing homelessness gather. Shifts start at 5:00 AM, and PIT survey training (online) is required.",
  },
  {
    field: "eventAssist",
    label: "Help out at the event.",
  },
  {
    field: "reportLocations",
    label: "Tell the Department of Human Services about places where people experiencing homelessness gather.",
  },
  {
    field: "shareFlyer",
    label: "Share and post the PHC/PIT flyer in Bergen County towns.",
  },
  {
    field: "donate",
    label: "Donate items.",
  },
  {
    field: "resourceTable",
    label: "Staff a resource table at the event (up to two staff per agency).",
  },
  {
    field: "distributionInfo",
    label: "Can't attend? Send us materials to hand out at the event by emailing hsplanning@bergencountynj.gov.",
  },
  {
    field: "directService",
    label: "Provide a free service on site.",
  },
]

export const shifts = {
  morning: "Shift 1: 7:30–11:00 AM",
  midday: "Shift 2: 10:30 AM–2:00 PM",
}

export const prompts = {
  streetTeamRegions: "Which regions are you willing to survey?",
  shifts: "Which shifts can you work?",
  donationDetails: "What would you like to donate?",
  resourceTableSummary: "Summarize the services you offer people experiencing homelessness.",
  directServiceDetails: "Which service will you provide?",
}

export const donateOnlineUrl =
  "https://main.govpilot.com/web/public/01f7306e-997_Donations-Application-bergencounty?uid=7443&ust=NJ&pu=1&id=1"

export const contactEmail = "hsplanning@bergencountynj.gov"
export const contactPhone = "201-336-7454"
