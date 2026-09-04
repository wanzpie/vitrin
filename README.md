# Vitrin

Commerce & Landing Page OS untuk kreator dan UMKM Indonesia.

## Repository

Monorepo TypeScript berbasis pnpm:
- `apps/web` — Next.js dashboard + storefront
- `apps/worker` — background jobs
- `services/api` — NestJS modular monolith
- `packages/block-schema` — JSON block schema
- `packages/sdk` — Public Storefront API SDK
- `packages/ui` — shared UI
- `infra` — local development infrastructure
- `docs` — PRD, PLAN, AGENT, and original product README

## Quick start

Requirements:
- Node.js >= 20
- pnpm >= 9
- Docker + Docker Compose

```bash
cp .env.example .env
docker compose -f infra/docker-compose.dev.yml up -d
pnpm install
pnpm dev
```

The implementation is currently a **Phase 0 foundation skeleton**. Product requirements,
architecture, roadmap, and coding rules are in `docs/`.

## Source documents

- `docs/PRD.md` — product requirements
- `docs/PLAN.md` — architecture and roadmap
- `docs/AGENT.md` — AI coding/contributor rules
- `docs/README.md` — original product README

## Important

Never commit `.env` or real API credentials. Payment/order/risk/IAM changes require
human review according to `docs/AGENT.md`.
