# Payload CMS 3 + Next.js 16 + Turso + Cloudflare R2

[![Payload CMS](https://img.shields.io/badge/Payload%20CMS-3.80.0-00D1B2?style=for-the-badge&logo=payload&logoColor=white)](https://payloadcms.com)
[![CI](https://github.com/Lostovayne/Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2/actions/workflows/ci.yml/badge.svg)](https://github.com/Lostovayne/Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/Lostovayne/Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2?style=for-the-badge&logo=semver)](https://github.com/Lostovayne/Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2/releases)
[![Forks](https://img.shields.io/github/forks/Lostovayne/Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2?style=for-the-badge&labelColor=000000&color=007acc)](https://github.com/Lostovayne/Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2network)
[![Stars](https://img.shields.io/github/stars/Lostovayne/Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2?style=for-the-badge&labelColor=000000&color=f5c51d)](https://github.com/Lostovayne/Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2/stargazers)
[![Issues](https://img.shields.io/github/issues/Lostovayne/Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2?style=for-the-badge&labelColor=000000&color=ed6a36)](https://github.com/Lostovayne/Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

Production-ready starter template combining Payload CMS 3, Next.js 16 App Router, Turso (SQLite edge database), and Cloudflare R2 for file storage.

---

## 🚀 Use This Template

Click the **"Use this template"** button on GitHub (not git clone) to create your own repository instantly:

1. Go to [github.com/Lostovayne/Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2](https://github.com/Lostovayne/Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2)
2. Click **"Use this template"** → **"Create a new repository"**
3. Name your project and click **Create**
4. Clone your new repo and start coding:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
pnpm install
```

> **Prefer cloning?** Run these commands instead:
> ```bash
> git clone https://github.com/Lostovayne/Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2.git
> cd Payload-CMS-3-Nextjs16-Turso-Cloudflare-R2
> git remote set-url origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
> pnpm install
> ```

---

## ⚡ Quick Start

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 2. Start development
pnpm dev
```

Open `http://localhost:3000/admin` — create your admin user on first visit.

### Environment Variables

| Variable | Description | How to get |
|---|---|---|
| `PAYLOAD_SECRET` | Encryption key (min 32 chars) | `openssl rand -base64 32` |
| `TURSO_DATABASE_URL` | Turso database URL | `turso db show <db> --url` |
| `TURSO_AUTH_TOKEN` | Turso auth token | `turso db tokens create <db>` |
| `R2_BUCKET_NAME` | Cloudflare R2 bucket name | Cloudflare Dashboard > R2 |
| `R2_ACCESS_KEY_ID` | R2 API access key | Manage R2 API Tokens |
| `R2_SECRET_ACCESS_KEY` | R2 API secret key | Shown once on creation |
| `R2_ENDPOINT` | R2 endpoint URL | `https://<account-id>.r2.cloudflarestorage.com` |

See [docs/QUICKSTART.md](./docs/QUICKSTART.md) for step-by-step setup with Turso CLI and Cloudflare Dashboard.

---

## ✨ Features

- **Payload CMS 3.80.0** — Headless CMS with full admin panel
- **Next.js 16 App Router** — React 19 with server components
- **Turso** — Edge SQLite database with global replication
- **Cloudflare R2** — S3-compatible storage (zero egress fees)
- **Lexical Editor** — Rich text editing
- **JWT Authentication** — Built-in user management
- **REST + GraphQL** — Auto-generated API endpoints
- **TypeScript** — End-to-end type safety
- **Docker** — Multi-stage optimized build
- **CI/CD** — GitHub Actions, auto-format, security audit
- **Testing** — Vitest (integration) + Playwright (E2E)

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Payload CMS | 3.80.0 | Headless CMS |
| Next.js | 16.2 | React framework |
| React | 19.2.3 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Turso / libSQL | 0.15.15 | Edge database |
| Cloudflare R2 | — | File storage |
| Drizzle Kit | 0.31.10 | Database migrations |

---

## 💻 Development

```bash
pnpm dev              # Start dev server (http://localhost:3000)
pnpm devsafe          # Start dev server (clean cache)
pnpm build            # Build for production
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm test             # Run all tests
pnpm generate:types   # Regenerate TypeScript types
```

### Project Structure

```
src/
├── app/
│   ├── (frontend)/        # Public frontend
│   ├── (payload)/         # Admin panel
│   ├── api/health/        # Health check endpoint
│   └── my-route/          # Example custom API route
├── collections/
│   ├── Users.ts           # User collection with auth
│   └── Media.ts           # File uploads (stored in R2)
├── payload.config.ts      # Central Payload configuration
└── payload-types.ts       # Auto-generated TypeScript types
```

---

## 🚀 Deployment

| Platform | Guide |
|---|---|
| **Vercel** (recommended) | [docs/VERCEL.md](./docs/VERCEL.md) |
| **Docker** | `docker-compose up -d` |
| **Railway / Render / Fly.io** | [docs/DOCKER.md](./docs/DOCKER.md) |

See [docs/DOCKER.md](./docs/DOCKER.md) for detailed deployment guides.

---

## 📚 Documentation

| Guide | Description |
|---|---|
| [QUICKSTART.md](./docs/QUICKSTART.md) | Get running in 5 minutes |
| [DEVELOPMENT.md](./docs/DEVELOPMENT.md) | Create collections, fields, customize |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Technical architecture |
| [COMMANDS.md](./docs/COMMANDS.md) | Complete command reference |
| [CI_CD.md](./docs/CI_CD.md) | GitHub Actions and automation |

---

## 🤝 Contributing

Contributions are welcome! Read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

1. Fork the repository
2. Create a branch (`git checkout -b feature/my-feature`)
3. Commit (`git commit -m 'feat: add my feature'`)
4. Push (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 🔒 Security

Report vulnerabilities via [SECURITY.md](./SECURITY.md).

---

## 📄 License

[MIT](LICENSE)
