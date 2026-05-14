# Agent Hub

A Next.js demo showcasing [CDP Account-Scoped Delegated Signing](https://docs.cdp.coinbase.com/wallets/using-wallets/delegated-signing).

Users sign in with their CDP wallet, then grant AI agents temporary (24-hour) per-wallet signing access. A Next.js API route uses the CDP Server SDK to sign messages on the agent's behalf — no private keys, no user presence required.

## Features

- **Sign in** via CDP React (`AuthButton`, `CDPReactProvider`)
- **Per-wallet delegation** — grant / revoke independently per wallet
- **24-hour auto-expiry** — delegations expire automatically
- **Agent signing** — `/api/sign` uses `@coinbase/cdp-sdk` to call `cdp.endUser.signEvmMessage()`
- **Activity log** — see each signature the agent produced, expandable with full message + signature
- **Dark theme** — CDP SDK UI themed to match the dark palette via `CDPReactProvider`'s `theme` prop

## Setup

```bash
cp .env.example .env.local
# fill in values
```

`.env.local`:

```env
NEXT_PUBLIC_CDP_PROJECT_ID=your-project-id

CDP_API_KEY_ID=your-api-key-id
CDP_API_KEY_SECRET=your-api-key-secret
CDP_WALLET_SECRET=your-wallet-secret
```

## Run

```bash
pnpm dev
```

Opens at [http://localhost:3000](http://localhost:3000).

## Architecture

```
app/
  layout.tsx          # Server layout — imports <Providers>
  page.tsx            # Client page — sign-in / hub routing
  api/
    sign/
      route.ts        # POST /api/sign — CDP SDK server-side signing
components/
  Providers.tsx       # CDPReactProvider + QueryClientProvider (client)
  AgentHubScreen.tsx  # Authenticated hub with wallet cards
  WalletCard.tsx      # Per-wallet delegation + agent controls
  SignInScreen.tsx    # Pre-auth landing
  Loading.tsx
  Icons.tsx
lib/
  config.ts           # cdpConfig + queryClient
  theme.ts            # CDP dark theme (Partial<Theme>)
  delegationStorage.ts # localStorage cache for delegation expiry
```
