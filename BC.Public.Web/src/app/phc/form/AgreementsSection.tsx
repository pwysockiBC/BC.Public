// "Agreements": the four agreements, each folded away until opened, with its own checkbox.
// Uses the browser's built-in <details>, which works with the keyboard and screen readers.

import { FieldError } from "@/lib/components/form/FieldError"
import { FormSection } from "@/lib/components/form/FormSection"
import { agreements, type Agreement, type AgreementBlock, type AgreementKey } from "./agreementsText"
import { CheckboxField } from "./fields"

// Which form field records each agreement's tick.
const fieldFor: Record<AgreementKey, "agreeVolunteer" | "agreeTerms" | "agreePrivacy" | "agreeTraining"> = {
  volunteer: "agreeVolunteer",
  terms: "agreeTerms",
  privacy: "agreePrivacy",
  training: "agreeTraining",
}

export function AgreementsSection() {
  return (
    <FormSection title="Agreements" description="Open and read each one, then tick the box under it.">
      <div className="space-y-5">
        {agreements.map((agreement) => (
          <AgreementItem key={agreement.key} agreement={agreement} />
        ))}
      </div>
    </FormSection>
  )
}

function AgreementItem({ agreement }: { agreement: Agreement }) {
  const field = fieldFor[agreement.key]
  return (
    <div className="space-y-2">
      <details className="group rounded-md border">
        <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium">
          {agreement.title}
          <span className="ml-2 text-xs font-normal text-muted-foreground group-open:hidden">(select to read)</span>
        </summary>
        <div className="max-h-80 space-y-3 overflow-y-auto border-t px-3 py-3 text-sm leading-relaxed">
          {agreement.blocks.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </div>
      </details>
      <CheckboxField name={field} label={agreement.confirm} />
      <FieldError name={field} />
    </div>
  )
}

function Block({ block }: { block: AgreementBlock }) {
  switch (block.kind) {
    case "heading":
      return <h3 className="pt-1 font-semibold">{block.text}</h3>
    case "paragraph":
      return <p>{block.text}</p>
    case "list":
      return (
        <ul className="list-disc space-y-1 pl-5">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case "lines":
      return (
        <p>
          {block.items.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      )
  }
}
