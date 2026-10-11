<div align="center">

# Letter by Pabitra Mohan Singh

**Send beautifully animated, self-destructing letters over the web.**

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

## Demo

### Live

https://letter.pabitramohansingh.com

### Screenshots

<p align="center">
  <img src="./public/screenshots/desktop-editor.jpg" alt="Letter editor" width="400" />
  <img src="./public/screenshots/desktop-letter.jpg" alt="Letter view" width="400" />
</p>

<p align="center">
  <img src="./public/screenshots/mobile-editor.jpg" alt="Mobile editor" width="220" />
  <img src="./public/screenshots/mobile-letter.jpg" alt="Mobile letter" width="220" />
</p>

## Features

- **Customizable letters** – background, effect, font, message box, buttons
- **Interactive patterns** – Two Choice, One Choice, Note Only
- **Motion effects** – hearts, confetti, snow, fireworks, petals, sparkles, and more
- **Google authentication** – secure sign-in via Better Auth
- **Auto-expiry** – letters delete themselves after a set number of days
- **Downloadable exports** – save letters as PNG or standalone HTML
- **Edge-deployed** – runs on Cloudflare Workers globally
- **TypeScript** – end-to-end strict type checking
- **Fully responsive** – mobile-first layout with Tailwind CSS

## Technology Stack

- React 19 (frontend)
- Vite (build tool)
- TypeScript 7
- Hono (backend framework)
- Cloudflare Workers (deployment)
- Cloudflare D1 (SQLite database)
- Better Auth (Google OAuth)
- Drizzle ORM
- Motion (animations)
- Tailwind CSS 4
- PNPM

## Architecture Overview

Two rendering targets:

1. **Live app** – React + Motion + Tailwind
2. **Downloaded HTML** – Plain HTML + CSS + vanilla JS

Both must look identical. The `letter/` folder holds every variant, animation, and pattern that supports both.

### Core Layers

- **`src/pages/`** – Route pages (Home, LetterView)
- **`src/letter/`** – Letter rendering system (variants, animations, patterns, editor)
- **`src/core/`** – Shared infrastructure
  - `components/` – Reusable UI components
  - `export/` – HTML + image export modules
  - `lib/` – Utilities (api, auth-client)

### Dependency Flow

```text
pages → letter → core → db
```

## Getting Started

### Prerequisites

- Node.js 22.x
- PNPM 10.x
- Cloudflare account (for deployment)
- Google OAuth credentials (for sign-in)

### Installation

```bash
git clone https://github.com/thepabitrams/letterpabitramohansingh.git
cd letterpabitramohansingh
pnpm install
```

### Local Environment

Create `.dev.vars` at the project root:

```env
BETTER_AUTH_SECRET=<your-secret>
BETTER_AUTH_URL=http://localhost:5173
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

`.dev.vars` is gitignored. Never commit it.

### Database Setup

Generate and apply Drizzle migrations locally:

```bash
npx drizzle-kit generate
pnpm wrangler d1 migrations apply letter-db --local
```

### Development

```bash
pnpm dev
```

Runs on `http://localhost:5173`.

### Production Build

```bash
pnpm build
```

### Manual Deploy

```bash
pnpm build
pnpm wrangler deploy
```

## Deployment

Production deployment is automated via Cloudflare Workers Builds.

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `pnpm run build` |
| Deploy command | `pnpm wrangler deploy` |
| Preview command | `pnpm wrangler versions upload` |

Push to `main` triggers a production deploy to `letter.pabitramohansingh.com`. Pushes to any other branch create preview versions.

### Required Secrets

Set once via Wrangler:

```bash
pnpm wrangler secret put BETTER_AUTH_SECRET
pnpm wrangler secret put GOOGLE_CLIENT_ID
pnpm wrangler secret put GOOGLE_CLIENT_SECRET
```

### Cloudflare Bindings

Configured in `wrangler.jsonc`:

- DB – D1 database (letter-db)

## Folder Structure

```text
src/
├── core/                # Shared infrastructure
│   ├── components/      # Reusable UI
│   ├── export/          # HTML + image export
│   └── lib/             # Utilities
├── letter/              # Letter rendering system
│   ├── background/      # Colors + animations
│   ├── button/          # Button styles + animations
│   ├── effect/          # Particle effects
│   ├── message-box/     # Message box styles
│   ├── text/            # Typography
│   ├── patterns/        # Two-choice, one-choice, note-only
│   ├── editor/          # Editor UI
│   └── tokens/          # Design tokens
└── pages/               # Route pages

public/                  # Static assets
wrangler.jsonc           # Cloudflare Workers config
drizzle.config.ts        # Drizzle ORM config
vite.config.ts           # Vite config
package.json             # Project manifest
```

## Documentation

- [`src/letter/README.md`](src/letter/README.md) – How the letter rendering system works

## Contributing

Issues and PRs are welcome.

## License

This project is licensed under the [MIT License](./LICENSE).

Third-party attributions: [NOTICE](./NOTICE) · Full license texts: [LICENSES/](./LICENSES/)

---

<div align="center">

**Made by [Pabitra Mohan Singh](https://www.linkedin.com/in/pabitramohansingh)**

</div>