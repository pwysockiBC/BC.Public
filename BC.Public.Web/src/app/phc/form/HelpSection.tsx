// "How you'd like to help": the activities, and under each one the question it asks when
// ticked (regions for the street team, shifts for event help, the answers for donations,
// resource tables and direct services).

import type { ReactNode } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { CheckboxList } from "@/lib/components/form/CheckboxList"
import { FieldError } from "@/lib/components/form/FieldError"
import { FormField } from "@/lib/components/form/FormField"
import { FormSection } from "@/lib/components/form/FormSection"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import type { FormRegion } from "../phcApi"
import { activities, donateOnlineUrl, prompts, shifts, type ActivityField } from "./activityWording"
import { CheckboxField } from "./fields"
import type { PhcFormValues } from "./phcSchema"

export function HelpSection({ regions }: { regions: FormRegion[] }) {
  const { control } = useFormContext<PhcFormValues>()
  const participation = useWatch({ control, name: "participation" })

  return (
    <FormSection title="How you'd like to help" description="Choose at least one.">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.field} className="space-y-3">
            <CheckboxField name={`participation.${activity.field}`} label={activity.label} />
            {participation[activity.field] && <FollowUp field={activity.field} regions={regions} />}
          </div>
        ))}
      </div>
      <FieldError name="participation.root" />
    </FormSection>
  )
}

// The question under a ticked activity, indented so it reads as part of it.
function FollowUp({ field, regions }: { field: ActivityField; regions: FormRegion[] }) {
  switch (field) {
    case "streetTeam":
      return (
        <Indented>
          <RegionChoice regions={regions} />
        </Indented>
      )
    case "eventAssist":
      return (
        <Indented>
          <div className="space-y-2">
            <Label>{prompts.shifts}</Label>
            <CheckboxField name="participation.shiftMorning" label={shifts.morning} />
            <CheckboxField name="participation.shiftMidday" label={shifts.midday} />
            <FieldError name="participation.shifts" />
          </div>
        </Indented>
      )
    case "donate":
      return (
        <Indented>
          <Answer name="donationDetails" label={prompts.donationDetails} />
          <p className="text-sm">
            Prefer to give money?{" "}
            <a href={donateOnlineUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              Donate online
            </a>
            .
          </p>
        </Indented>
      )
    case "resourceTable":
      return (
        <Indented>
          <Answer name="resourceTableSummary" label={prompts.resourceTableSummary} />
        </Indented>
      )
    case "directService":
      return (
        <Indented>
          <Answer name="directServiceDetails" label={prompts.directServiceDetails} />
        </Indented>
      )
    default:
      return null
  }
}

function Indented({ children }: { children: ReactNode }) {
  return <div className="ml-6 space-y-3 border-l pl-4">{children}</div>
}

function RegionChoice({ regions }: { regions: FormRegion[] }) {
  const { control } = useFormContext<PhcFormValues>()
  const options = regions.map((region) => ({
    id: region.id,
    name: region.name,
    description: region.locations.join(", "),
  }))

  return (
    <div className="space-y-2">
      <Label>{prompts.streetTeamRegions}</Label>
      <Controller
        control={control}
        name="streetTeamRegionIds"
        render={({ field }) => (
          <CheckboxList name="region" options={options} value={field.value} onChange={field.onChange} columns={1} />
        )}
      />
      <FieldError name="streetTeamRegionIds" />
    </div>
  )
}

function Answer({ name, label }: { name: "donationDetails" | "resourceTableSummary" | "directServiceDetails"; label: string }) {
  const { register, formState } = useFormContext<PhcFormValues>()
  const error = formState.errors.participation?.[name]?.message
  return (
    <FormField label={label} htmlFor={name} error={error}>
      <Textarea id={name} rows={3} maxLength={2000} aria-invalid={error ? true : undefined} {...register(`participation.${name}`)} />
    </FormField>
  )
}
