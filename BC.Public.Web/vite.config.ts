// Vite settings for the public forms: React, Tailwind, the "@" path alias, and a dev proxy
// that sends /api/<app>/... to that app's local public API with the prefix removed, as IIS does.

import { fileURLToPath, URL } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type ProxyOptions } from "vite"

// Local public API ports. Keep in step with each API's launchSettings.json.
const apis: Record<string, number> = {
  phc: 5201,
}

function apiProxy(key: string, port: number): [string, ProxyOptions] {
  const prefix = `/api/${key}`
  return [
    prefix,
    {
      target: `http://localhost:${port}`,
      rewrite: (p) => p.slice(prefix.length) || "/",
    },
  ]
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: {
    // 5173 is BC.Internal.Web, so both can run at once.
    port: 5174,
    strictPort: true,
    proxy: Object.fromEntries(Object.entries(apis).map(([k, p]) => apiProxy(k, p))),
  },
})
