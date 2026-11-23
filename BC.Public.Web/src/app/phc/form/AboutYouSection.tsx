// "About you": the applicant's name, address and contact details, and their date of birth
// only when they say they're under 18.

import { useFormContext, useWatch } from "react-hook-form"
import { FormSection } from "@/lib/components/form/FormSection"
import { CheckboxField, TextField } from "./fields"
import type { PhcFormValues } from "./phcSchema"

export function AboutYouSection() {
  const { control } = useFormContext<PhcFormValues>()
  const isUnder18 = useWatch({ control, name: "isUnder18" })

  return (
    <FormSection title="About you">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="firstName" label="First name" autoComplete="given-name" />
        <TextField name="lastName" label="Last name" autoComplete="family-name" />
        <div className="sm:col-span-2">
          <TextField name="addressLine" label="Address" autoComplete="street-address" />
        </div>
        <TextField name="city" label="Town / city" autoComplete="address-level2" />
        <div className="grid grid-cols-2 gap-4">
          <TextField name="state" label="State" autoComplete="address-level1" />
          <TextField name="zipCode" label="ZIP" autoComplete="postal-code" inputMode="numeric" />
        </div>
        <TextField name="phone" label="Phone" type="tel" autoComplete="tel" hint="Include the area code." />
        <TextField name="email" label="Email" type="email" autoComplete="email" hint="We'll send your confirmation here." />
      </div>

      <div className="space-y-3">
        <CheckboxField name="isUnder18" label="I'm under 18" />
        {isUnder18 && (
          <div className="max-w-xs">
            <TextField name="dateOfBirth" label="Date of birth" type="date" />
          </div>
        )}
      </div>
    </FormSection>
  )
}
