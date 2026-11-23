// The entry point: sets up data fetching, then renders the PHC registration page.
// One form for now; a router comes in when a second public app joins this site.

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ApiError } from "@/lib/api/http"
import { PhcPage } from "@/app/phc/PhcPage"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // A 4xx won't fix itself, so it's shown at once; a network blip or 5xx is retried once.
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) {
          return false
        }
        return failureCount < 1
      },
      // Refetching on focus would issue a new form token and could reset the form mid-entry.
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PhcPage />
    </QueryClientProvider>
  </StrictMode>,
)
