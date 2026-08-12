<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# GoodMash.io website

Public product website for GoodMash.io. No proprietary code, credentials or
backend architecture are ever published here. The site only explains WHAT
GoodMash does, never HOW the proprietary technology works.

Commands (use `npm.cmd` on this machine — the `.ps1` wrapper is blocked):
- `npm.cmd run dev` — start dev server
- `npm.cmd run lint` — ESLint
- `npm.cmd run build` — production build + type check
- `npm.cmd start` — serve production build

Key locations:
- `src/app/*/page.tsx` — the 22 public pages
- `src/components/AgentWidget.tsx` — 24/7 AI support agent chat UI
- `src/app/api/agent/route.ts` — agent API (placeholder logic in `src/lib/agentEngine.ts`; wire real AI here, keeping keys server-side)
- `src/components/CheckoutWidget.tsx` — Ozow explanatory checkout (demo, no real charges)
- `src/components/DemoPage.tsx` — clearly-marked DEMO/PREVIEW experience

Security rule: never add secrets, keys, admin URLs or implementation details
to this website. Anything added here is public.
