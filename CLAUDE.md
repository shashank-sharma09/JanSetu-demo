# JanSetu Civic Portal

Hackathon demo of a civic-accountability loop: citizens report issues (**Awaaz**), officers claim them and submit proof of work (**Saboot**), and an AI audit (**Pramaan**) approves or flags each fix. Frontend only; all data is in-memory seed data.

Live demo: https://shashank-sharma09.github.io/fluffy-octo-garbanzo/

## Commands

- `npm install` then `npm run dev` for local dev at http://localhost:5173
- `npx tsc --noEmit -p .` to type-check (must stay at 0 errors)
- `npm run build` for a production build
- Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`

## Structure

Everything lives in `src/App.tsx` (React 18 + Vite, Tailwind via arbitrary-value classes):

- **Domain**: `CATEGORIES` (cost benchmarks), `priorityScore` (Anumodan × severity weight), `runPramaan` (the deterministic audit: every check shown on the verification screen is derived from its result).
- **Seed data**: `INITIAL_ISSUES`, `INITIAL_OFFICERS`, `CITIZEN_DEMO` / `OFFICER_DEMO`.
- **App shell**: `App` owns all state (`issues`, `officers`, `user`, `currentScreen`, `activeIssueId`) and passes handlers down. Navigation is a `currentScreen` string, not a router.
- **Screens**: `ScreenAuth`, `ScreenAwaazFeed`, `ScreenPostAwaaz`, `ScreenOfficerTaskBoard`, `ScreenSabootSubmission`, `ScreenAIVerification`, `ScreenPublicLedger`, `ScreenProfile`.
- **Shared UI**: `Icon`, `IssueImage` (falls back to a placeholder), `StatusBadge`, `StatusStepper`, `StatTile`, `PageHeader`, `SegmentedTabs`.

Issue status flow: `Pending` → `Claimed` → `Completed` (approved) or `Flagged` (confidence < 75%). Only `Completed`/`Flagged` issues have a `verification` object.

## Design tokens

Use these hex values in Tailwind arbitrary classes (e.g. `bg-[#1B263B]`); the same tokens are declared as CSS variables in `Shell`.

| Role | Hex |
|---|---|
| Page background | `#BFDDF0` |
| Card / sidebar / primary | `#1B263B` |
| Light accent surface (tab tracks) | `#B4E1EB` |
| Secondary (borders, meta text, in-card buttons) | `#8CC0EB` |
| Text on navy | `#FFF9D2` |
| Text on light blue | `#1B263B` |
| Inset surface inside cards (inputs, wells) | `#121A2B` |
| Raised surface inside cards (chips, secondary buttons) | `#2A3A55` |
| Success / Error / Warning | `#6BBF4A` / `#F44336` / `#FF9800` |

Text placed directly on the page background must be navy, never cream.
