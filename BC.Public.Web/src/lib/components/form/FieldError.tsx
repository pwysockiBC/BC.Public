// A field's validation message, looked up by its path in a React Hook Form form
// (e.g. "participation.shifts"), for errors that don't belong to a single input.
// Must be used inside a FormProvider.

import { get, useFormContext } from "react-hook-form"

export function FieldError({ name }: { name: string }) {
  const { formState } = useFormContext()
  const error = get(formState.errors, name) as { message?: string } | undefined
  if (!error?.message) {
    return null
  }
  return (
    <p className="text-xs text-destructive" role="alert">
      {error.message}
    </p>
  )
}
