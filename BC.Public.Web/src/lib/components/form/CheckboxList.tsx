// A list of checkboxes for choosing several items by id, such as regions or languages.
// value holds the chosen ids; onChange receives the new list. An option can carry a short
// description shown under its name (e.g. the towns in a region).

import { Checkbox } from "@/lib/components/ui/checkbox"
import { Label } from "@/lib/components/ui/label"

export type CheckboxOption = { id: number; name: string; description?: string }

type CheckboxListProps = {
  // Used to build each checkbox's id, so labels stay unique on the page.
  name: string
  options: CheckboxOption[]
  value: number[]
  onChange: (value: number[]) => void
  // Two columns suit short names; descriptions read better in one.
  columns?: 1 | 2
}

export function CheckboxList({ name, options, value, onChange, columns = 2 }: CheckboxListProps) {
  function toggle(id: number, checked: boolean) {
    if (checked) {
      onChange([...value, id])
    } else {
      onChange(value.filter((chosen) => chosen !== id))
    }
  }

  if (options.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing to choose from yet.</p>
  }

  return (
    <div className={columns === 2 ? "grid gap-3 sm:grid-cols-2" : "grid gap-3"}>
      {options.map((option) => {
        const inputId = `${name}-${option.id}`
        return (
          <div key={option.id} className="flex items-start gap-2">
            <Checkbox
              id={inputId}
              className="mt-0.5"
              checked={value.includes(option.id)}
              onCheckedChange={(checked) => toggle(option.id, checked === true)}
            />
            <div className="space-y-0.5">
              <Label htmlFor={inputId} className="font-normal">
                {option.name}
              </Label>
              {option.description && <p className="text-xs text-muted-foreground">{option.description}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
