// "Your organization": optional. Once any field is filled in, the name is required.

import { FormSection } from "@/lib/components/form/FormSection"
import { TextField } from "./fields"

export function OrganizationSection() {
  return (
    <FormSection
      title="Your organization (optional)"
      description="If you're registering for an agency or group, tell us about it. One registration per organization covers all its volunteers at the event."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField name="affiliationName" label="Organization name" autoComplete="organization" />
        </div>
        <div className="sm:col-span-2">
          <TextField name="affiliationAddressLine" label="Address" />
        </div>
        <TextField name="affiliationCity" label="Town / city" />
        <div className="grid grid-cols-2 gap-4">
          <TextField name="affiliationState" label="State" />
          <TextField name="affiliationZipCode" label="ZIP" inputMode="numeric" />
        </div>
        <div className="grid grid-cols-[1fr_6rem] gap-4">
          <TextField name="affiliationPhone" label="Phone" type="tel" />
          <TextField name="affiliationPhoneExt" label="Ext." />
        </div>
        <TextField name="affiliationEmail" label="Email" type="email" />
      </div>
    </FormSection>
  )
}
