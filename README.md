# Jerma Logs

The frontend for [logs.jerma.io](https://logs.jerma.io) — a searchable archive of every message
Jerma985 has sent in twitch chat, going back to May 2020.

Built with [Nuxt 4](https://nuxt.com), Nuxt UI, Pinia and Tailwind CSS. Messages are read from
Firestore (REST for the cached server routes, the client SDK for realtime updates on the current
month), search is powered by Algolia, and emotes/badges come from the Twitch and BetterTTV APIs.

## Setup

```bash
npm install
```

Create a `.env` with:

```bash
NUXT_PUBLIC_TWITCH_USERNAME=   # channel to show messages for
NUXT_PUBLIC_TWITCH_ID=         # that channel's twitch user id
NUXT_TWITCH_API_BASE_URL=      # https://api.twitch.tv/helix/
NUXT_TWITCH_CLIENT_ID=
NUXT_TWITCH_CLIENT_SECRET=
ALGOLIA_API_KEY=               # search-only key, it is exposed to the browser
ALGOLIA_APPLICATION_ID=
```

## Development

```bash
npm run dev        # http://localhost:3000
npm run dev:host   # exposed on the local network
```

## Checks

```bash
npm run lint       # eslint (@antfu/eslint-config)
npm run typecheck  # vue-tsc via nuxt typecheck
npm run test       # playwright against a local dev server
npm run test:live  # playwright against production
```

## Production

```bash
npm run build
npm run preview
```

Deploys as a Node server (see `Dockerfile`) or to Cloudflare Workers (see `wrangler.json`).
The Firebase Cloud Functions used for push notifications live in `functions/`.
