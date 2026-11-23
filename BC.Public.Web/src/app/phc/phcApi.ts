// PHC's API calls and the types they use, generated from the public API's OpenAPI file
// (npm run api:types): GET /form for the form's choices and token, POST /applications to submit.

import { useQuery } from "@tanstack/react-query"
import { getJson, postJson } from "@/lib/api/http"
import type { components } from "./generated/phc"

export type FormResponse = components["schemas"]["FormResponse"]
export type FormRegion = components["schemas"]["FormRegion"]
export type FormOption = components["schemas"]["FormOption"]
export type SubmitApplicationRequest = components["schemas"]["SubmitApplicationRequest"]
export type SubmitApplicationResult = components["schemas"]["SubmitApplicationResult"]

const base = "/api/phc"

export const phcFormQueryKey = ["phc", "form"]

export function fetchPhcForm() {
  return getJson<FormResponse>(`${base}/form`)
}

// The open project, its choices, and a form token. Named to avoid confusion with React Hook Form's useForm.
export function usePhcForm() {
  return useQuery({
    queryKey: phcFormQueryKey,
    queryFn: fetchPhcForm,
    // A token is good for 24 hours, so the response is never refetched in the background.
    staleTime: Infinity,
  })
}

export function submitApplication(request: SubmitApplicationRequest) {
  return postJson<SubmitApplicationResult>(`${base}/applications`, request)
}
