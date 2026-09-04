# Vitrin

**Commerce & Landing Page OS untuk kreator dan UMKM Indonesia.** Satu platform untuk produk digital, fisik (termasuk COD), membership, dan afiliasi — lengkap dengan AI page builder dan checkout WhatsApp-native.

> Nama "Vitrin" adalah nama kerja. Dokumen produk lengkap ada di [`PRD.md`](./PRD.md), rencana teknis & roadmap di [`PLAN.md`](./PLAN.md), dan panduan kerja untuk AI coding agent di [`AGENT.md`](./AGENT.md).

---

## Kenapa Vitrin?

Seller Indonesia biasanya menyambung beberapa tools sekaligus: link-in-bio (Lynk.id) untuk produk digital, COD funnel builder (Scalev) untuk produk fisik, dan WhatsApp manual untuk konfirmasi order. Vitrin menyatukan semuanya dalam satu data model, plus fitur pembeda:

| Pembeda | Deskripsi singkat |
|---|---|
| 🧠 AI Page Builder | Bikin landing page lengkap dari satu prompt/voice note |
| 🛒 Unified Cart | Satu keranjang untuk produk digital + fisik + COD + membership |
| 💬 WA Order Bot + Risk Scoring | Konfirmasi COD otomatis, hanya eskalasi manual untuk order berisiko |
| 🔌 Headless & Agent-Ready | Storefront API publik + endpoint MCP untuk agentic commerce |
| 🧩 No-code + Pro-code | Editor drag-and-drop *dan* mode HTML/JS custom dalam satu produk |
| 🤝 Afiliasi Marketplace | Afiliasi dapat microsite otomatis dari katalog seller yang diikuti |

Perbandingan lengkap dengan Lynk.id, Mayar.id, Scalev, dan platform WA-commerce ada di `PRD.md` §3.

---

## Tech Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** NestJS (modular monolith) + PostgreSQL + Redis/BullMQ
- **Analytics:** ClickHouse (event/funnel), Meilisearch (pencarian produk)
- **Payment:** Xendit/Midtrans (QRIS, VA, e-wallet, kartu, COD)
- **Messaging:** WhatsApp Business Cloud API
- **AI:** Anthropic Claude API (copywriting, agent tooling, risk-reasoning)
- **Infra:** Docker, GitHub Actions CI/CD, mulai di Fly.io/Railway → K8s saat skala naik

Detail arsitektur lengkap: lihat `PLAN.md` §2–§4.

---

## Struktur Repo (usulan)

```
vitrin/
├── apps/
│   ├── web/                # Next.js: dashboard + storefront renderer
│   └── worker/              # Job processor (BullMQ): WA, AI, payout, dsb.
├── services/
│   └── api/                 # NestJS core API (modular monolith)
│       ├── src/modules/
│       │   ├── store/
│       │   ├── product/
│       │   ├── cart-checkout/
│       │   ├── order/
│       │   ├── payment/
│       │   ├── shipping/
│       │   ├── affiliate/
│       │   ├── wa-crm/
│       │   ├── ai/
│       │   ├── analytics/
│       │   └── iam/
├── packages/
│   ├── ui/                  # Komponen UI bersama
│   ├── block-schema/        # Skema JSON block page builder (dipakai web + api)
│   └── sdk/                 # Client SDK untuk Public Storefront API
├── docs/
│   ├── PRD.md
│   ├── PLAN.md
│   ├── README.md
│   └── AGENT.md
├── infra/                   # Terraform, docker-compose, k8s manifests
└── .github/workflows/       # CI/CD
```

---

## Menjalankan Secara Lokal

> Prasyarat: Node.js ≥ 20, pnpm ≥ 9, Docker & Docker Compose, akun sandbox Xendit/Midtrans, akun WhatsApp Business API sandbox (opsional untuk fitur non-WA).

```bash
# 1. Clone & install
git clone <repo-url> vitrin
cd vitrin
pnpm install

# 2. Jalankan dependency lokal (Postgres, Redis, ClickHouse, Meilisearch)
docker compose -f infra/docker-compose.dev.yml up -d

# 3. Salin & isi environment variables
cp .env.example .env

# 4. Migrasi database
pnpm --filter api db:migrate

# 5. Jalankan semua service dalam mode dev
pnpm dev
```

- Dashboard/storefront: `http://localhost:3000`
- API: `http://localhost:4000`
- Dokumentasi API (OpenAPI/Swagger): `http://localhost:4000/docs`

---

## Environment Variables (contoh minimal)

```bash
DATABASE_URL=postgres://user:pass@localhost:5432/vitrin
REDIS_URL=redis://localhost:6379
PSP_XENDIT_API_KEY=xnd_development_xxx
WA_CLOUD_API_TOKEN=xxx
WA_CLOUD_PHONE_NUMBER_ID=xxx
ANTHROPIC_API_KEY=xxx
STORAGE_S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com
STORAGE_S3_BUCKET=vitrin-media
JWT_SECRET=change-me
```

Jangan pernah commit file `.env` berisi kredensial asli — lihat `AGENT.md` §Keamanan.

---

## Script Umum

| Perintah | Fungsi |
|---|---|
| `pnpm dev` | Jalankan semua app dalam mode development |
| `pnpm build` | Build semua package/app |
| `pnpm test` | Jalankan seluruh unit/integration test |
| `pnpm test:e2e` | Jalankan test end-to-end (checkout, COD, afiliasi) |
| `pnpm lint` | Lint seluruh codebase |
| `pnpm --filter api db:migrate` | Jalankan migrasi database |
| `pnpm --filter api db:seed` | Isi data contoh untuk development |

---

## Status Proyek

Repo ini masih di tahap **Fase 0 — Discovery & Fondasi** (lihat `PLAN.md` §5). Roadmap dan prioritas fitur bisa berubah seiring validasi dengan seller nyata.

## Kontribusi

Lihat `AGENT.md` untuk konvensi kode, alur kerja Git, dan aturan main bagi kontributor manusia maupun AI coding agent (Claude Code, dsb).

## Lisensi

Belum ditentukan — placeholder, isi sesuai kebutuhan bisnis (proprietary/closed-source disarankan untuk tahap awal SaaS komersial).
