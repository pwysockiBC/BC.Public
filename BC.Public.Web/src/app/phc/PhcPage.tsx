// The PHC registration page: the heading, then the form when registration is open, a "closed"
// message with the next opening date when it isn't, and the confirmation once it's submitted.

import { useState, type ReactNode } from "react"
import { formatDateTime, formatLongDate } from "@/lib/utils/format"
import { Confirmation } from "./Confirmation"
import { contactEmail, contactPhone } from "./form/activityWording"
import { PhcForm } from "./form/PhcForm"
import { usePhcForm, type SubmitApplicationResult } from "./phcApi"
import { useSubmitRegistration } from "./useSubmitRegistration"

type Saved = { result: SubmitApplicationResult; email: string }

export function PhcPage() {
  const form = usePhcForm()
  const submit = useSubmitRegistration()
  const [saved, setSaved] = useState<Saved | null>(null)
  // Bumped to start a new, empty form after a registration.
  const [formNumber, setFormNumber] = useState(1)

  function handleSaved(result: SubmitApplicationResult, email: string) {
    setSaved({ result, email })
    window.scrollTo({ top: 0 })
  }

  // A fresh token for the next person, and a blank form.
  function registerAnother() {
    setSaved(null)
    setFormNumber((n) => n + 1)
    void form.refetch()
    window.scrollTo({ top: 0 })
  }

  const project = form.data?.isOpen ? form.data.project : null

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <header className="mb-8 space-y-1">
          <h1 className="text-2xl font-semibold sm:text-3xl">Project Homeless Connect (PHC) – Point-In-Time (PIT)</h1>
          <p className="text-muted-foreground">Registration form</p>
        </header>

        {saved ? (
          <Confirmation result={saved.result} email={saved.email} onRegisterAnother={registerAnother} />
        ) : (
          <>
            {form.isPending && <p>Loading the form…</p>}

            {form.isError && (
              <Notice>
                The registration form couldn't be loaded. Please try again in a few minutes. If it keeps happening,
                contact us at <ContactLinks />.
              </Notice>
            )}

            {form.data && !project && (
              <Notice>
                <p className="font-medium">Registration isn't open right now.</p>
                {form.data.nextOpensAt && <p className="mt-1">It opens {formatDateTime(form.data.nextOpensAt)}.</p>}
              </Notice>
            )}

            {form.data && project && (
              <>
                <div className="mb-6 rounded-lg border bg-background p-4">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{formatLongDate(project.eventDate)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Registration closes {formatDateTime(project.registrationClosesAt)}.
                  </p>
                </div>

                <PhcForm
                  key={formNumber}
                  form={form.data}
                  eventDate={project.eventDate}
                  onSubmit={submit}
                  onSaved={handleSaved}
                />
              </>
            )}
          </>
        )}

        <footer className="mt-12 border-t pt-4 text-sm text-muted-foreground">
          Questions? Bergen County Department of Human Services, <ContactLinks />.
        </footer>
      </main>
    </div>
  )
}

function Notice({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border bg-background p-4">{children}</div>
}

function ContactLinks() {
  return (
    <>
      <a href={`tel:${contactPhone}`} className="underline underline-offset-4">
        {contactPhone}
      </a>{" "}
      or{" "}
      <a href={`mailto:${contactEmail}`} className="underline underline-offset-4">
        {contactEmail}
      </a>
    </>
  )
}
