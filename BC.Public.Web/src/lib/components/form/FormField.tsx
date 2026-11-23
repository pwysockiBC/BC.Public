// One labeled field: the label, the input passed in as children, an optional hint, and its error.
// The same as BC.Internal.Web's FormField.

import type { ReactNode } from "react"
import { Label } from "@/lib/components/ui/label"

type FormFieldProps = {
  label: string
  // Must match the input's id, so clicking the label focuses the input.
  htmlFor: string
  children: ReactNode
  hint?: string
  // The field's validation message, from React Hook Form: errors.email?.message
  error?: string
}

export function FormField({ label, htmlFor, children, hint, error }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
