// The form's fields and rules, and turning the answers into the API's request.
// The rules mirror the public API's ApplicationRules (the intake contract), so people see
// problems before submitting; the API checks them all again.

import { z } from "zod"
import { todayIso } from "@/lib/utils/format"
import type { SubmitApplicationRequest } from "../phcApi"
import { AGREEMENTS_VERSION } from "./agreementsText"

function requiredText(max: number) {
  return z.string().trim().min(1, "Required.").max(max, `At most ${max} characters.`)
}
function optionalText(max: number) {
  return z.string().trim().max(max, `At most ${max} characters.`)
}
function mustTick(message: string) {
  return z.boolean().refine((ticked) => ticked, message)
}

const zipPattern = /^\d{5}(-\d{4})?$/
const zipMessage = "Enter a 5-digit ZIP code, such as 07601."
const emailMessage = "Enter a valid email address, such as name@example.com."

function digitCount(value: string) {
  return value.replace(/\D/g, "").length
}

// 18th birthday after the event date → under 18 on the day. Dates are "yyyy-mm-dd" strings,
// which compare correctly as text.
function isUnder18On(dateOfBirth: string, day: string) {
  const [year, month, date] = dateOfBirth.split("-")
  const eighteenth = `${Number(year) + 18}-${month}-${date}`
  return eighteenth > day
}

// The schema needs the event date, for the under-18 check.
export function makePhcSchema(eventDate: string) {
  return z
    .object({
      // Hidden from people; anything in it came from a bot. Sent as is.
      homepage: z.string(),

      firstName: requiredText(100),
      lastName: requiredText(100),
      isUnder18: z.boolean(),
      dateOfBirth: z.string(),
      addressLine: requiredText(200),
      city: requiredText(100),
      state: requiredText(50),
      zipCode: z.string().trim().regex(zipPattern, zipMessage),
      phone: requiredText(30).refine((value) => digitCount(value) >= 10, "Enter a phone number with area code."),
      email: requiredText(256).email(emailMessage),

      affiliationName: optionalText(200),
      affiliationAddressLine: optionalText(200),
      affiliationCity: optionalText(100),
      affiliationState: optionalText(50),
      affiliationZipCode: z.union([z.literal(""), z.string().trim().regex(zipPattern, zipMessage)]),
      affiliationPhone: optionalText(30),
      affiliationPhoneExt: optionalText(10),
      affiliationEmail: z.union([z.literal(""), z.string().trim().max(256).email(emailMessage)]),

      participation: z.object({
        pitSurvey: z.boolean(),
        streetTeam: z.boolean(),
        eventAssist: z.boolean(),
        reportLocations: z.boolean(),
        shareFlyer: z.boolean(),
        donate: z.boolean(),
        resourceTable: z.boolean(),
        distributionInfo: z.boolean(),
        directService: z.boolean(),
        shiftMorning: z.boolean(),
        shiftMidday: z.boolean(),
        donationDetails: optionalText(2000),
        resourceTableSummary: optionalText(2000),
        directServiceDetails: optionalText(2000),
      }),

      streetTeamRegionIds: z.array(z.number()).max(50),
      spokenLanguageIds: z.array(z.number()).max(50),

      // One tick per agreement; the API receives a single "all accepted".
      agreeVolunteer: mustTick("Read and accept the Volunteer / Affiliate Agreement."),
      agreeTerms: mustTick("Read and accept the Terms of Use Policy."),
      agreePrivacy: mustTick("Read and accept the Privacy Statement."),
      agreeTraining: mustTick("Confirm that you'll attend the required training."),
    })
    .superRefine((v, ctx) => {
      if (v.isUnder18) {
        if (!v.dateOfBirth) {
          ctx.addIssue({ code: "custom", path: ["dateOfBirth"], message: "Enter your date of birth." })
        } else if (v.dateOfBirth > todayIso()) {
          ctx.addIssue({ code: "custom", path: ["dateOfBirth"], message: "Date of birth can't be in the future." })
        } else if (!isUnder18On(v.dateOfBirth, eventDate)) {
          ctx.addIssue({
            code: "custom",
            path: ["dateOfBirth"],
            message: "This date makes you 18 or older on the day of the event. Untick \"I'm under 18\" if that's right.",
          })
        }
      }

      const orgFields = [
        v.affiliationAddressLine, v.affiliationCity, v.affiliationState, v.affiliationZipCode,
        v.affiliationPhone, v.affiliationPhoneExt, v.affiliationEmail,
      ]
      if (!v.affiliationName && orgFields.some((field) => field !== "")) {
        ctx.addIssue({
          code: "custom",
          path: ["affiliationName"],
          message: "Enter the organization's name, or clear the organization fields.",
        })
      }

      const p = v.participation
      const anyActivity =
        p.pitSurvey || p.streetTeam || p.eventAssist || p.reportLocations || p.shareFlyer ||
        p.donate || p.resourceTable || p.distributionInfo || p.directService
      if (!anyActivity) {
        ctx.addIssue({ code: "custom", path: ["participation", "root"], message: "Choose at least one way to help." })
      }
      if (p.streetTeam && v.streetTeamRegionIds.length === 0) {
        ctx.addIssue({ code: "custom", path: ["streetTeamRegionIds"], message: "Choose at least one region for the street team." })
      }
      if (p.eventAssist && !p.shiftMorning && !p.shiftMidday) {
        ctx.addIssue({ code: "custom", path: ["participation", "shifts"], message: "Choose at least one shift." })
      }
      if (p.donate && !p.donationDetails) {
        ctx.addIssue({ code: "custom", path: ["participation", "donationDetails"], message: "Describe what you'd like to donate." })
      }
      if (p.resourceTable && !p.resourceTableSummary) {
        ctx.addIssue({ code: "custom", path: ["participation", "resourceTableSummary"], message: "Summarize the services you'd offer." })
      }
      if (p.directService && !p.directServiceDetails) {
        ctx.addIssue({ code: "custom", path: ["participation", "directServiceDetails"], message: "Tell us which service you'd offer." })
      }
    })
}

export type PhcFormValues = z.input<ReturnType<typeof makePhcSchema>>

// A blank form. Inputs hold text, so empty values are "". Agreements start unticked.
export const emptyPhcForm: PhcFormValues = {
  homepage: "",
  firstName: "",
  lastName: "",
  isUnder18: false,
  dateOfBirth: "",
  addressLine: "",
  city: "",
  state: "NJ",
  zipCode: "",
  phone: "",
  email: "",
  affiliationName: "",
  affiliationAddressLine: "",
  affiliationCity: "",
  affiliationState: "",
  affiliationZipCode: "",
  affiliationPhone: "",
  affiliationPhoneExt: "",
  affiliationEmail: "",
  participation: {
    pitSurvey: false,
    streetTeam: false,
    eventAssist: false,
    reportLocations: false,
    shareFlyer: false,
    donate: false,
    resourceTable: false,
    distributionInfo: false,
    directService: false,
    shiftMorning: false,
    shiftMidday: false,
    donationDetails: "",
    resourceTableSummary: "",
    directServiceDetails: "",
  },
  streetTeamRegionIds: [],
  spokenLanguageIds: [],
  agreeVolunteer: false,
  agreeTerms: false,
  agreePrivacy: false,
  agreeTraining: false,
}

// The answers as the API's request. Blank optional text goes as null; shifts, answers and
// regions are dropped when their activity isn't chosen (the API does the same).
export function toRequest(v: PhcFormValues, projectId: number, formToken: string): SubmitApplicationRequest {
  const p = v.participation
  return {
    projectId,
    formToken,
    homepage: v.homepage,
    firstName: v.firstName.trim(),
    lastName: v.lastName.trim(),
    isUnder18: v.isUnder18,
    dateOfBirth: v.isUnder18 && v.dateOfBirth ? v.dateOfBirth : null,
    addressLine: v.addressLine.trim(),
    city: v.city.trim(),
    state: v.state.trim(),
    zipCode: v.zipCode.trim(),
    phone: v.phone.trim(),
    email: v.email.trim(),
    affiliationName: blankToNull(v.affiliationName),
    affiliationAddressLine: blankToNull(v.affiliationAddressLine),
    affiliationCity: blankToNull(v.affiliationCity),
    affiliationState: blankToNull(v.affiliationState),
    affiliationZipCode: blankToNull(v.affiliationZipCode),
    affiliationPhone: blankToNull(v.affiliationPhone),
    affiliationPhoneExt: blankToNull(v.affiliationPhoneExt),
    affiliationEmail: blankToNull(v.affiliationEmail),
    participation: {
      pitSurvey: p.pitSurvey,
      streetTeam: p.streetTeam,
      eventAssist: p.eventAssist,
      reportLocations: p.reportLocations,
      shareFlyer: p.shareFlyer,
      donate: p.donate,
      resourceTable: p.resourceTable,
      distributionInfo: p.distributionInfo,
      directService: p.directService,
      shiftMorning: p.eventAssist && p.shiftMorning,
      shiftMidday: p.eventAssist && p.shiftMidday,
      donationDetails: p.donate ? blankToNull(p.donationDetails) : null,
      resourceTableSummary: p.resourceTable ? blankToNull(p.resourceTableSummary) : null,
      directServiceDetails: p.directService ? blankToNull(p.directServiceDetails) : null,
    },
    streetTeamRegionIds: p.streetTeam ? v.streetTeamRegionIds : [],
    spokenLanguageIds: v.spokenLanguageIds,
    agreementsAccepted: v.agreeVolunteer && v.agreeTerms && v.agreePrivacy && v.agreeTraining,
    agreementsVersion: AGREEMENTS_VERSION,
  }
}

function blankToNull(value: string) {
  const trimmed = value.trim()
  return trimmed === "" ? null : trimmed
}
