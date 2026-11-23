// What the person sees after their registration is saved: the reference number, whether the
// confirmation email went out, and a way to register someone else.

import { Button } from "@/lib/components/ui/button"
import type { SubmitApplicationResult } from "./phcApi"

type ConfirmationProps = {
  result: SubmitApplicationResult
  email: string
  onRegisterAnother: () => void
}

export function Confirmation({ result, email, onRegisterAnother }: ConfirmationProps) {
  return (
    <section className="space-y-4 rounded-lg border bg-background p-6" aria-live="polite">
      <h2 className="text-xl font-semibold">Thank you. Your registration has been received.</h2>

      <div>
        <p className="text-sm text-muted-foreground">Your reference number</p>
        <p className="font-mono text-2xl font-semibold tracking-wider">{result.referenceNumber}</p>
      </div>

      {result.confirmationEmailSent ? (
        <p>
          We've emailed a confirmation to <strong>{email}</strong>. If it doesn't arrive in a few minutes, check
          your junk or spam folder.
        </p>
      ) : (
        <p>
          We couldn't send a confirmation email, so please write down your reference number. Your registration was
          still received.
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <Button variant="outline" onClick={() => window.print()}>
          Print this page
        </Button>
        <Button variant="outline" onClick={onRegisterAnother}>
          Register someone else
        </Button>
      </div>
    </section>
  )
}
