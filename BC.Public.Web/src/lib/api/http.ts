// How the public forms talk to their APIs: one place for requests and for turning a failed
// response into an ApiError the form can inspect. The same shape as BC.Internal.Web's http.ts.

// A request that got a response, but not a successful one.
export class ApiError extends Error {
  status: number
  // The problem-details body the API sent, if any: { title, status, errors? }
  problem?: unknown

  constructor(status: number, problem?: unknown) {
    super(`Request failed with status ${status}`)
    this.status = status
    this.problem = problem
  }
}

// GET a URL and return its JSON. Throws ApiError for any non-success response.
export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { headers: { Accept: "application/json" } })
  return readResponse<T>(response)
}

// POST a JSON body and return the JSON response. Throws ApiError for any non-success response.
export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  return readResponse<T>(response)
}

// The field errors from a 400, keyed by camelCase JSON path (e.g. "participation.donationDetails");
// empty for any other error.
export function fieldErrors(error: unknown): Record<string, string[]> {
  if (!(error instanceof ApiError) || error.status !== 400) {
    return {}
  }
  return (error.problem as { errors?: Record<string, string[]> } | undefined)?.errors ?? {}
}

// The problem's title (e.g. the 429 "Too many requests" message), if the API sent one.
export function problemTitle(error: unknown): string | undefined {
  if (!(error instanceof ApiError)) {
    return undefined
  }
  return (error.problem as { title?: string } | undefined)?.title
}

// fetch only throws on network failure, so a 400 or 500 has to be checked here.
async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const problem = await response.json().catch(() => undefined)
    throw new ApiError(response.status, problem)
  }
  return (await response.json()) as T
}
