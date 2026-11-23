// The PHC registration form: its sections, the hidden honeypot field, and the submit button.
// It checks the answers itself, then hands them to onSubmit. What comes back decides what it
// shows: errors on the fields the API rejected, a message above the button for anything else,
// or nothing, when the page moves on to the confirmation.

import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { FormProvider, useForm, useFormContext, type Path } from "react-hook-form"
import { Button } from "@/lib/components/ui/button"
import type { FormResponse, SubmitApplicationResult } from "../phcApi"
import type { SubmitOutcome } from "../useSubmitRegistration"
import { AboutYouSection } from "./AboutYouSection"
import { AgreementsSection } from "./AgreementsSection"
import { HelpSection } from "./HelpSection"
import { LanguagesSection } from "./LanguagesSection"
import { OrganizationSection } from "./OrganizationSection"
import { emptyPhcForm, makePhcSchema, type PhcFormValues } from "./phcSchema"
import { sortServerErrors } from "./serverErrors"

type PhcFormProps = {
  form: FormResponse
  eventDate: string
  onSubmit: (values: PhcFormValues) => Promise<SubmitOutcome>
  onSaved: (result: SubmitApplicationResult, email: string) => void
}

export function PhcForm({ form, eventDate, onSubmit, onSaved }: PhcFormProps) {
  const schema = useMemo(() => makePhcSchema(eventDate), [eventDate])
  const methods = useForm<PhcFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyPhcForm,
  })
  // Messages from the API that don't belong to one field.
  const [messages, setMessages] = useState<string[]>([])

  async function submit(values: PhcFormValues) {
    setMessages([])
    const outcome = await onSubmit(values)

    if (outcome.kind === "saved") {
      onSaved(outcome.result, values.email.trim())
      return
    }
    if (outcome.kind === "failed") {
      setMessages([outcome.message])
      return
    }

    const sorted = sortServerErrors(outcome.errors)
    sorted.fields.forEach((field, index) => {
      // Some paths (e.g. "participation.shifts") are messages for a group, not inputs, so they
      // aren't in the form's value types.
      methods.setError(field.path as Path<PhcFormValues>, { type: "server", message: field.message }, { shouldFocus: index === 0 })
    })
    if (sorted.general.length > 0) {
      setMessages(sorted.general)
    } else if (sorted.fields.length > 0) {
      setMessages(["Some answers need attention. They're marked above."])
    }
  }

  const isSubmitting = methods.formState.isSubmitting

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submit)} noValidate className="space-y-6">
        <AboutYouSection />
        <OrganizationSection />
        <HelpSection regions={form.streetTeamRegions} />
        <LanguagesSection languages={form.spokenLanguages} />
        <AgreementsSection />
        <Honeypot />

        {messages.length > 0 && (
          <div role="alert" className="rounded-md border border-destructive bg-background p-3 text-sm">
            {messages.length === 1 ? (
              <p>{messages[0]}</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5">
                {messages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit registration"}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

// A field people never see or reach with the keyboard; bots that fill in every field fill this
// too, and the API quietly drops their submission. Not display:none, which some bots skip.
function Honeypot() {
  const { register } = useFormContext<PhcFormValues>()
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
      <label htmlFor="homepage">Leave this field empty</label>
      <input id="homepage" type="text" tabIndex={-1} autoComplete="off" {...register("homepage")} />
    </div>
  )
}
