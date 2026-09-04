# Vitrin Repository Setup

This repository is the initial implementation skeleton derived from PRD, PLAN,
AGENT, and README.

## Initial scope

The repository intentionally starts with the Phase 0 foundation:
- Next.js web app
- NestJS API modular-monolith placeholder
- Worker placeholder for BullMQ
- Shared block schema
- Public SDK placeholder
- Docker development dependencies
- GitHub Actions CI
- Product/engineering documents under `docs/`

## Next implementation order

Follow `docs/PLAN.md` Phase 0 and Phase 1:
1. Auth, tenant/store setup, RBAC
2. Product CRUD
3. Block page builder
4. Checkout and payment adapters
5. COD + shipping
6. WhatsApp confirmation
7. AI page builder
8. Payout and affiliate foundations

Do not implement Tier 2/3 features ahead of the active roadmap without product-owner confirmation.
