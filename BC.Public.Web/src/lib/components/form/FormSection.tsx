// A titled group of fields within a form, such as "About you" or "How you'd like to help".
// The same as BC.Internal.Web's FormSection, with room for a longer description.

import type { ReactNode } from "react"

type FormSectionProps = {
  title: string
  description?: ReactNode
  children: ReactNode
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <fieldset className="space-y-4 rounded-lg border p-4 sm:p-6">
      <legend className="px-1 text-base font-semibold">{title}</legend>
      {description && <div className="text-sm text-muted-foreground">{description}</div>}
      {children}
    </fieldset>
  )
}
