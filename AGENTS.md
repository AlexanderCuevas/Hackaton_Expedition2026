# AGENTS.md — SkillPath AI

## Stack

React 19 + TypeScript (frontend), Express + `@google/genai` (backend), Vite (bundler), Tailwind CSS v4, motion, lucide-react, recharts.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server (Express + Vite middleware via `tsx server.ts`) |
| `npm run build` | `vite build` (frontend) + `esbuild server.ts --bundle --platform=node...` (backend) |
| `npm run start` | Run compiled production server (`node dist/server.cjs`) |
| `npm run lint` | **Type-check only** via `tsc --noEmit` |
| `npm run clean` | Unix-only `rm -rf` — use `Remove-Item -Recurse -Force dist` on Windows |

No test framework is configured.

## Structure

```
server.ts          — Express server (API routes + Vite middleware in dev)
src/main.tsx       — React entrypoint
src/App.tsx        — Root component (routing by view state, no react-router)
src/components/    — 7 page-level components (RouteDashboard, DiagnosticoWizard, CvAnalyzerPanel, etc.)
src/types.ts       — All TypeScript interfaces
src/data.ts        — Mock data for vacancies, contacts, posts, courses
```

## API routes (all `server.ts`)

| Route | Purpose |
|---|---|
| `POST /api/profile/analyze` | Analyze skills → employability score + gaps + missions |
| `POST /api/cv/analyze` | ATS CV analysis |
| `POST /api/interview/chat` | Interview simulation chat |
| `POST /api/interview/evaluate` | Evaluate interview session |

All routes have **offline mock fallbacks** — the app runs without a Gemini API key.

## Quirks

- **`@/` alias** maps to project root (`./`), not `src/`. Import as `@/src/components/...`.
- **Dev server** starts on port 3000 (Express manages everything, Vite runs in middleware mode).
- **Tailwind v4**: uses `@import "tailwindcss"` in CSS, not the old PostCSS plugin config.
- **Env**: `GEMINI_API_KEY` in `.env.local` (gitignored). Falls back to mock data if missing.
- **HMR / file watching**: Disable with `DISABLE_HMR=true` env var for agent-friendly editing.
- **Model**: Uses `gemini-3.5-flash` (AI Studio custom model name, not standard Gemini).
- **State**: Persisted to `localStorage` under keys `sp_profile`, `sp_gaps`, `sp_missions`.
- **UI routing**: Simple state-driven view switching in `App.tsx`, no react-router.
- **Deployment target**: Google AI Studio applet (see `metadata.json` — `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`).
- **TS config**: `experimentalDecorators: true`, `useDefineForClassFields: false`, `moduleDetection: "force"`, `allowJs: true`.
