# Milestone Web

Next.js App Router scaffold for Milestone.

## What is included

- Landing page with branded layout
- Dashboard and public transparency views
- Mock auth flow with hardcoded credentials
- Wallet login placeholders for Freighter and Beexo
- Route handlers for mock session creation and logout

## Local run

Install dependencies inside `apps/web` and run:

```bash
pnpm install
pnpm dev
```

## Hardcoded demo credentials

- Email: `team@milestone.app`
- Password: `milestone-demo`

## Notes

- This scaffold intentionally stays inside `apps/web`.
- Root workspace glue is not created here, so if you want a true pnpm monorepo, add the workspace files at the repo root in a follow-up step.

