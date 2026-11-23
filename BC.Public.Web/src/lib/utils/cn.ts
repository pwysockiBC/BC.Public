// Combines Tailwind class names, letting later classes win over earlier ones,
// e.g. cn("px-2 text-sm", isWide && "px-6") → "text-sm px-6".
// Every shadcn component uses it; shared components use it too.

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
