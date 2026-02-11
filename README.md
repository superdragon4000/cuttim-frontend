# Cuttim Frontend

Next.js frontend for laser cutting service MVP.

## Stack

- Next.js App Router
- FSD-style structure (`shared`, `entities`, `features`, `widgets`, `app`)
- Redux Toolkit
- i18n (`next-intl`, locales: `en`, `ru`)
- Tailwind CSS + CSS variables themes
- Storybook (`@storybook/nextjs-vite`)
- Visual regression screenshots (Playwright)
- Vitest (Vite-based test runner)

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run storybook
npm run build-storybook
npm run test:visual:update
npm run test:visual
```

## Env

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Routes

- `/en` or `/ru` — landing + how-it-works
- `/en/preview` — quote preview:
  - guest: local demo calculator
  - client auth: real backend flow (`/files/upload` -> `/orders/preview` -> `/orders/create` -> `/payments/create`)
- `/en/cabinet/orders` — real client order list from `/orders`
- `/en/manager/orders` — real manager list + status/payment/tracking actions
- `/en/auth/login` — real auth (`/auth/login`, `/auth/register`)

