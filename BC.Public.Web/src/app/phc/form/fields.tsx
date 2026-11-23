// Small field pieces the PHC form's sections share: a labeled text input bound to the form,
// and a checkbox with its label. They read the form through useFormContext.

import type { ComponentProps } from "react"
import { Controller, get, useFormContext } from "react-hook-form"
import { FormField } from "@/lib/components/form/FormField"
import { Checkbox } from "@/lib/components/ui/checkbox"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import type { PhcFormValues } from "./phcSchema"

type TextPath =
  | "firstName" | "lastName" | "dateOfBirth" | "addressLine" | "city" | "state" | "zipCode" | "phone" | "email"
  | "affiliationName" | "affiliationAddressLine" | "affiliationCity" | "affiliationState" | "affiliationZipCode"
  | "affiliationPhone" | "affiliationPhoneExt" | "affiliationEmail"

type TextFieldProps = {
  name: TextPath
  label: string
  hint?: string
} & Omit<ComponentProps<"input">, "name">

// A text input with its label and error. The input's id is the field name.
export function TextField({ name, label, hint, ...input }: TextFieldProps) {
  const { register, formState } = useFormContext<PhcFormValues>()
  const error = (get(formState.errors, name) as { message?: string } | undefined)?.message
  return (
    <FormField label={label} htmlFor={name} hint={hint} error={error}>
      <Input id={name} aria-invalid={error ? true : undefined} {...input} {...register(name)} />
    </FormField>
  )
}

type BooleanPath =
  | "isUnder18"
  | "agreeVolunteer" | "agreeTerms" | "agreePrivacy" | "agreeTraining"
  | `participation.${"pitSurvey" | "streetTeam" | "eventAssist" | "reportLocations" | "shareFlyer" | "donate" | "resourceTable" | "distributionInfo" | "directService" | "shiftMorning" | "shiftMidday"}`

// A checkbox bound to a yes/no field, with its label beside it.
export function CheckboxField({ name, label }: { name: BooleanPath; label: string }) {
  const { control } = useFormContext<PhcFormValues>()
  const id = name.replace(".", "-")
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex items-start gap-2">
          <Checkbox
            id={id}
            className="mt-0.5"
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            aria-invalid={fieldState.error ? true : undefined}
          />
          <Label htmlFor={id} className="font-normal leading-snug">
            {label}
          </Label>
        </div>
      )}
    />
  )
}
