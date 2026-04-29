# Shelby Marketplace

A marketplace for data agents and data assets on Shelbynet. Built with Astro, React islands, Aptos wallet integration, and the Shelby SDK.

## Routes

- `/` — landing page and marketplace overview
- `/browse` — public marketplace catalog with search, filters, and sorting
- `/upload` — wallet-gated asset publishing flow
- `/my-blobs` — publisher dashboard via Shelby indexer
- `/blob/[address]/[filename]` — public asset detail and access link
- `/api/fund` — server route to fund wallet with ShelbyUSD
- `/api/upload-blob` — server-side Shelby RPC upload proxy
- `/api/blobs` — server-side Shelby indexer proxy

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Fill `.env` with your server-side keys:

```bash
GEOMI_API_KEY=
SHELBY_API_KEY=
PUBLIC_APTOS_NETWORK=shelbynet
PUBLIC_SHELBY_RPC_URL=https://api.shelbynet.shelby.xyz/shelby
PUBLIC_SHELBY_EXPLORER_URL=https://explorer.shelby.xyz/shelbynet
PUBLIC_SITE_URL=http://localhost:4321
```

Never put Geomi/Shelby secret keys in a `PUBLIC_*` variable. Secret API calls are routed through Astro server endpoints.

## Upload flow

Browser code does **not** use `ShelbyClient.upload()` because wallet users never expose a full keypair.

Manual flow:

1. Generate Shelby storage commitments from file bytes.
2. Call `/api/fund` so the wallet has ShelbyUSD before registration.
3. Build `ShelbyBlobClient.createRegisterBlobPayload()`.
4. Ask the connected wallet to sign and submit the registration transaction.
5. Upload bytes through `/api/upload-blob`, which calls Shelby RPC server-side.
6. Load owned assets through `/api/blobs`, which calls the Shelby indexer server-side.

## Checks

```bash
npm test
npx astro check
npm run build
```

## Deploy

Configured for Vercel server output via `@astrojs/vercel` because API routes need server runtime.
