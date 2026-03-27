# Milestone Web

Next.js App Router product shell for Milestone.

## What is included

- Landing page with branded layout
- Dashboard and public transparency views
- Mock auth flow with hardcoded credentials
- Freighter-first wallet flow prepared with Stellar Wallets Kit
- Route handlers for mock session creation and logout

## Local run

Use Node.js `22.18.0` or newer and `pnpm 10.32.1` or newer. Then install dependencies inside `apps/web` and run:

```bash
pnpm install
pnpm dev
```

## Hardcoded demo credentials

- Email: `team@milestone.app`
- Password: `milestone-demo`

## Notes

- This scaffold intentionally stays inside `apps/web`.
- The repository already has a root workspace, so you can also run it from the repo root with `pnpm web:dev`.
- Freighter is the current visible wallet path for the Stellar-based flow. The generic credentials path remains as a temporary fallback for operators and judges.
