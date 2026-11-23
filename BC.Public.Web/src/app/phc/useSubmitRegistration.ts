// Sends a registration and sorts out what came back, as the intake contract describes:
//   201               → saved, with the reference number
//   400 formToken     → the form expired: fetch a new token, wait out the minimum fill time,
//                       and send once more, so nothing the person typed is lost
//   400 other keys    → rejected answers, for the form to show on its fields
//   413, 429, 5xx     → a message for the whole form
//   network failure   → a message for the whole form

import { useQueryClient } from "@tanstack/react-query"
import { ApiError, fieldErrors, problemTitle } from "@/lib/api/http"
import { contactEmail, contactPhone } from "./form/activityWording"
import { toRequest, type PhcFormValues } from "./form/phcSchema"
import {
  fetchPhcForm,
  phcFormQueryKey,
  submitApplication,
  type FormResponse,
  type SubmitApplicationResult,
} from "./phcApi"

export type SubmitOutcome =
  | { kind: "saved"; result: SubmitApplicationResult }
  | { kind: "rejected"; errors: Record<string, string[]> }
  | { kind: "failed"; message: string }

// The API refuses a submission sooner than this after the token was issued (Spam:MinimumFillSeconds),
// so a resubmission with a brand-new token waits a little longer than that.
const freshTokenWaitMs = 3500

const tryAgainMessage =
  `We couldn't submit your registration. Please try again in a few minutes. ` +
  `If it keeps happening, contact us at ${contactPhone} or ${contactEmail}.`

export function useSubmitRegistration() {
  const queryClient = useQueryClient()

  async function submit(values: PhcFormValues): Promise<SubmitOutcome> {
    // Always the latest form response, in case the token was refreshed earlier.
    const form = queryClient.getQueryData<FormResponse>(phcFormQueryKey)
    if (!form?.project || !form.formToken) {
      return { kind: "failed", message: "Registration isn't open right now." }
    }

    const first = await send(values, form.project.id, form.formToken)
    if (first.kind !== "rejected" || !first.errors.formToken) {
      return first
    }

    // The token expired (or the API's keys changed): get a new one and send once more.
    let fresh: FormResponse
    try {
      fresh = await queryClient.fetchQuery({ queryKey: phcFormQueryKey, queryFn: fetchPhcForm, staleTime: 0 })
    } catch {
      return { kind: "failed", message: tryAgainMessage }
    }
    if (!fresh.isOpen || !fresh.project || !fresh.formToken) {
      return { kind: "failed", message: "Registration has closed." }
    }
    await delay(freshTokenWaitMs)
    return send(values, fresh.project.id, fresh.formToken)
  }

  return submit
}

async function send(values: PhcFormValues, projectId: number, formToken: string): Promise<SubmitOutcome> {
  try {
    const result = await submitApplication(toRequest(values, projectId, formToken))
    return { kind: "saved", result }
  } catch (error) {
    if (!(error instanceof ApiError)) {
      return { kind: "failed", message: tryAgainMessage }
    }
    if (error.status === 400) {
      return { kind: "rejected", errors: fieldErrors(error) }
    }
    if (error.status === 413 || error.status === 429) {
      return { kind: "failed", message: problemTitle(error) ?? tryAgainMessage }
    }
    return { kind: "failed", message: tryAgainMessage }
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
