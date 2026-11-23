// "Languages": optional; the active languages from GET /form.

import { Controller, useFormContext } from "react-hook-form"
import { CheckboxList } from "@/lib/components/form/CheckboxList"
import { FieldError } from "@/lib/components/form/FieldError"
import { FormSection } from "@/lib/components/form/FormSection"
import type { FormOption } from "../phcApi"
import type { PhcFormValues } from "./phcSchema"

export function LanguagesSection({ languages }: { languages: FormOption[] }) {
  const { control } = useFormContext<PhcFormValues>()
  if (languages.length === 0) {
    return null
  }
  return (
    <FormSection title="Languages" description="Do you speak any languages besides English? Optional.">
      <Controller
        control={control}
        name="spokenLanguageIds"
        render={({ field }) => (
          <CheckboxList name="language" options={languages} value={field.value} onChange={field.onChange} />
        )}
      />
      <FieldError name="spokenLanguageIds" />
    </FormSection>
  )
}
