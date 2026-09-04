# PLAN — Vitrin
**Rencana Teknis, Arsitektur, dan Roadmap Eksekusi**

| | |
|---|---|
| Dokumen | Engineering & Delivery Plan |
| Terkait | `PRD.md` (kebutuhan produk), `README.md` (setup), `AGENT.md` (aturan kerja untuk AI coding agent) |
| Versi | 1.0 — 4 September 2026 |

---

## 1. Prinsip Arsitektur

1. **API-first / headless dari hari pertama.** Web app resmi Vitrin adalah konsumen pertama dari API publik itu sendiri — bukan jalur khusus internal. Ini memaksa disiplin desain API dan memudahkan mode HTML/JS custom + agentic commerce di masa depan.
2. **Modular monolith dulu, microservices kalau perlu.** Hindari kompleksitas operasional microservices sebelum ada bukti kebutuhan skala. Modul dipisah secara logis (bounded context) di dalam satu codebase backend agar mudah dipecah nanti.
3. **Multi-tenant dengan isolasi baris (row-level).** Setiap tabel inti punya `tenant_id` (=store_id). Gunakan Postgres Row-Level Security sebagai lapisan pertahanan kedua, bukan satu-satunya.
4. **Event-driven untuk proses async.** Order, pembayaran, notifikasi WA, payout, dan job AI berjalan lewat message queue — bukan panggilan sinkron berantai — agar tahan gangguan pihak ketiga (PSP, Meta WA API, ekspedisi).
5. **Jangan bangun ulang yang sudah ada infrastruktur matangnya.** Payment rail pakai PSP agregator (Xendit/Midtrans), pengiriman pesan WA pakai WhatsApp Business Cloud API resmi/BSP (mis. melalui provider terverifikasi), bukan reverse-engineer WhatsApp Web.
6. **Human-in-the-loop untuk semua output AI generatif** yang mempengaruhi uang atau reputasi (harga, deskripsi produk publish, keputusan fraud auto-block).

---

## 2. Tech Stack (usulan)

| Layer | Pilihan | Alasan |
|---|---|---|
| Frontend (dashboard + storefront renderer) | Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui | SSR/ISR untuk landing page cepat & SEO-friendly; ekosistem matang |
| Page builder editor | React + dnd-kit + JSON block schema (bukan HTML string tersimpan) | Struktur data block memudahkan AI generate & A/B testing per-blok |
| Backend API | Node.js + NestJS (TypeScript), modular monolith | Struktur modul jelas (mirip domain di PRD §8), DI bawaan, mudah ditulis test |
| Database utama | PostgreSQL (mis. via Supabase/RDS terkelola) | Transaksi ACID untuk order/pembayaran, dukungan RLS |
| Cache & queue | Redis + BullMQ | Job async: kirim WA, generate AI, rekonsiliasi payout |
| Analytics/event store | ClickHouse (atau Postgres+Timescale di awal jika volume masih kecil) | Query funnel/atribusi cepat di skala besar |
| Object storage | Cloudflare R2 / S3-compatible | Media produk, hasil generate AI, file digital |
| Search produk | Meilisearch/Typesense | Pencarian produk cepat untuk storefront dgn banyak produk |
| Payment | Xendit dan/atau Midtrans sebagai PSP agregator | QRIS, VA, e-wallet, kartu, disbursement — tanpa perlu lisensi payment sendiri |
| WhatsApp | WhatsApp Business Cloud API (langsung Meta atau via BSP resmi) | Kepatuhan kebijakan Meta, template message terverifikasi |
| AI | Anthropic Claude API (copywriting, agent tooling, fraud-reasoning) + model image (background removal/upscaling) | Kualitas bahasa Indonesia & tool-use yang matang untuk alur agentic |
| Infra & deploy | Docker → mulai di Fly.io/Railway/managed K8s saat traffic naik | Kecepatan iterasi MVP > kompleksitas infra prematur |
| CI/CD | GitHub Actions | Lint, test, build, deploy otomatis per PR |
| Observability | OpenTelemetry + (Grafana/Datadog) | Trace order end-to-end lintas modul async |
| IaC | Terraform (mulai Fase 2 saat infra makin kompleks) | Reprodusibilitas environment |

---

## 3. Arsitektur Sistem (gambaran tekstual)

```
                         ┌────────────────────┐
                         │   Iklan (Meta/TikTok)│
                         └──────────┬──────────┘
                                    ▼
┌───────────────┐   render   ┌───────────────────┐
│  Page Builder  │──────────▶│  Storefront Edge   │◀────── Custom domain / subdomain
│  (dashboard)   │           │  (Next.js SSR/ISR) │
└───────┬────────┘           └─────────┬──────────┘
        │ CRUD block/produk            │ checkout submit
        ▼                              ▼
┌────────────────────────────────────────────────────────┐
│                     Vitrin Core API (NestJS)             │
│  Modules: Store, Product, Cart/Checkout, Order, Payment, │
│  Shipping, Affiliate, CRM/WA, AI, Analytics, IAM/RBAC     │
└───────┬───────────────┬───────────────┬──────────────────┘
        │               │               │
        ▼               ▼               ▼
 ┌────────────┐  ┌──────────────┐ ┌───────────────┐
 │ Postgres   │  │ Redis+BullMQ │ │ ClickHouse     │
 │ (OLTP)     │  │ (jobs/queue) │ │ (event/analytics)│
 └────────────┘  └──────┬───────┘ └───────────────┘
                         │
        ┌────────────────┼───────────────────┐
        ▼                ▼                    ▼
 ┌─────────────┐  ┌──────────────┐   ┌──────────────────┐
 │ PSP Adapter │  │ WA Adapter   │   │ Shipping Adapter  │
 │ (Xendit/    │  │ (WA Cloud    │   │ (JNE/J&T/SiCepat  │
 │  Midtrans)  │  │  API)        │   │  rate-shopping)   │
 └─────────────┘  └──────────────┘   └──────────────────┘

External-facing:
 ┌──────────────────────────────┐
 │ Public Storefront API (REST) │  ← headless checkout untuk custom frontend
 │ + MCP/Agent endpoint         │  ← agentic commerce (AI agents bertransaksi)
 └──────────────────────────────┘
```

**Prinsip adapter:** PSP, WhatsApp, dan ekspedisi masing-masing dibungkus adapter dengan interface seragam di dalam kode (`PaymentProvider`, `MessagingProvider`, `ShippingProvider`) agar mudah menambah provider baru tanpa mengubah domain logic inti — lihat `AGENT.md` §"Menambah Payment Provider Baru".

---

## 4. Skema Data Inti (ringkas, bukan final DDL)

- `stores` (tenant) — id, name, slug/subdomain, custom_domain, plan_tier, status
- `users` / `store_members` — RBAC role per store
- `products` — id, store_id, type(`digital`|`physical`|`service`|`membership`), price, metadata
- `product_variants` — varian (ukuran/warna), stok per gudang
- `warehouses` — multi-gudang per store
- `pages` — id, store_id, slug, blocks(JSONB), theme, seo_meta, status(draft/published), ab_test_group
- `carts` / `cart_items` — mendukung item campuran (digital+fisik+membership)
- `orders` / `order_items` — status lifecycle: `pending`→`awaiting_confirmation`(khusus COD)→`confirmed`→`shipped`→`delivered`/`returned`→`settled`
- `payments` — provider, method(qris/va/ewallet/card/cod), status, raw_webhook_ref
- `payouts` — jadwal, status, instant_flag
- `shipments` — kurir, resi, status tracking
- `risk_scores` — order_id, score, factors(JSONB), decision(auto_confirm/manual_review/block)
- `affiliates` / `affiliate_links` / `commissions`
- `wa_conversations` / `wa_messages` — log percakapan bot konfirmasi
- `ai_generations` — prompt, output, jenis(copy/image/page), status_review(pending/approved/rejected)
- `analytics_events` (di ClickHouse) — page_view, add_to_cart, checkout_started, order_confirmed, dst.

---

## 5. Roadmap & Fase Eksekusi

### Fase 0 — Discovery & Fondasi (Minggu 1–4)
- Validasi asumsi PRD lewat wawancara 15–20 calon seller (mix persona §4 PRD).
- Finalisasi tech stack, setup monorepo, CI/CD dasar, environment (dev/staging/prod).
- Desain skema database inti + ADR (Architecture Decision Record) untuk keputusan besar (mis. kenapa modular monolith, kenapa Postgres RLS).
- Setup akun PSP sandbox (Xendit/Midtrans) & WhatsApp Business API sandbox.

**Exit criteria:** repo siap, CI hijau, skema DB ter-review, 1 halaman "hello world" storefront ter-deploy end-to-end (domain → render → checkout dummy).

### Fase 1 — MVP (Minggu 5–18)
Fokus: modul D1, D2 (dasar), D3 (dasar), D4 (fondasi API), D5 (editor block; HTML mode bisa menyusul) dari PRD §5.1.

| Sprint (2 minggu) | Fokus |
|---|---|
| S1–S2 | Auth, multi-tenant store setup, RBAC dasar, product CRUD (digital+fisik) |
| S3–S4 | Page builder block editor (tanpa AI dulu) + publish ke subdomain |
| S5–S6 | Cart/checkout unified engine + integrasi PSP (QRIS/VA/e-wallet/kartu) |
| S7–S8 | Alur COD + integrasi ekspedisi dasar (3 kurir) + status order lifecycle |
| S9 | WhatsApp order confirmation (template dasar, belum AI risk-scoring penuh) |
| S10 | AI Page Builder v1 (generate dari prompt teks) |
| S11 | Payout dashboard (T+1) + rekonsiliasi otomatis |
| S12 | Program afiliasi dasar (link + tracking komisi manual payout) |
| S13–S14 | Hardening: security review, load test checkout, beta tertutup (50–100 seller) |

**Exit criteria:** metrik §6 PRD mulai terukur; beta closed berjalan tanpa insiden kritikal payment/data.

### Fase 2 — Diferensiasi (Minggu 19–30)
- Risk-scoring COD penuh (D3) + antrean manual review.
- Payout instan T+0 (D7) + integrasi disbursement instan.
- Afiliasi marketplace 2 arah dengan microsite otomatis (D6).
- Multi-gudang + rate-shopping ekspedisi (D8).
- AI: perbaikan foto produk, rewrite copy multi-gaya.

### Fase 3 — Skala & Growth Tooling (Minggu 31–42)
- A/B testing landing page bawaan + signifikansi statistik (D9).
- Multi-pixel/CAPI attribution dashboard (D10).
- LMS drip-content dasar untuk membership (D11).
- Live-selling pixel sync, scarcity widgets (D12).

### Fase 4 — Agentic Commerce & Ekspansi (Berkelanjutan, mulai ~Minggu 40+)
- MCP server publik penuh untuk agent AI pihak ketiga.
- Working capital advance untuk seller (perlu partner lending berlisensi).
- Multi-currency / cross-border.
- Jaringan blacklist fraud lintas-merchant (opt-in, perlu kajian privasi/PDP matang).
- Kepatuhan e-Faktur/PPN otomatis untuk seller PKP.

---

## 6. Tim & Peran (indikatif untuk MVP)

| Peran | Jumlah | Fokus |
|---|---|---|
| Product Manager | 1 | Prioritas backlog, riset user |
| Tech Lead / Architect | 1 | Keputusan arsitektur, code review kritikal |
| Backend Engineer | 2–3 | Modul core API, integrasi PSP/WA/ekspedisi |
| Frontend Engineer | 2 | Page builder editor, dashboard, storefront renderer |
| AI/ML Engineer | 1 | AI page builder, risk scoring model, prompt engineering |
| Product Designer | 1 | Desain sistem, UX checkout & editor |
| QA/Test Engineer | 1 | Test plan checkout & payment (jalur paling kritikal) |
| DevOps/SRE (paruh waktu di awal) | 1 | CI/CD, observability, infra |

---

## 7. Strategi Testing

- **Unit test** wajib untuk seluruh business logic modul Payment, Order, Risk Scoring (target coverage ≥ 80% pada modul ini secara khusus, tidak dipaksakan merata ke semua kode).
- **Integration test** untuk setiap adapter eksternal (PSP, WA, ekspedisi) memakai sandbox/mock resmi provider.
- **Contract test** untuk Public Storefront API (agar breaking change ketahuan sebelum deploy — penting karena API ini dikonsumsi headless & agent pihak ketiga).
- **E2E test** untuk 3 alur kritikal: checkout digital, checkout COD, alur afiliasi.
- **Load test** checkout endpoint sebelum tiap kampanye/momentum besar (mis. simulasi lonjakan traffic iklan).
- **Chaos/failure test** dasar: apa yang terjadi jika PSP webhook telat/gagal, jika WA API rate-limited, jika queue tersumbat.

---

## 8. Metrik Teknis & SLO

| Metrik | Target |
|---|---|
| Checkout success rate (non-error) | ≥ 99.5% |
| P95 latency create-order | < 800ms |
| Webhook payment processing lag | < 30 detik P95 |
| Uptime jalur checkout/payment | 99.9% |
| Waktu deploy ke produksi (lead time) | < 30 menit dari merge |
| MTTR insiden kritikal (payment/checkout down) | < 30 menit |

---

## 9. Risiko Teknis Utama & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Webhook PSP/ekspedisi tidak idempotent-aware → double-processing | Idempotency key wajib di semua handler webhook, dedup di level DB constraint |
| Rate limit WhatsApp Business API saat volume broadcast tinggi | Antrean terjadwal + backoff, prioritaskan pesan transaksional di atas pesan marketing |
| AI generate konten yang menyesatkan/melanggar kebijakan iklan | Guardrail prompt + review manual wajib sebelum publish, disclosure AI |
| Skema block JSON page builder berubah dan merusak halaman lama | Versioning skema block + migration script, render backward-compatible |
| Lock-in ke satu PSP tunggal | Interface `PaymentProvider` abstrak sejak awal (bukan hardcode ke satu vendor) |

---

## 10. Definition of Done (level fitur)

Sebuah fitur dianggap selesai jika:
1. Memenuhi acceptance criteria di user story terkait (`PRD.md` §8).
2. Ada unit/integration test yang relevan dan lulus di CI.
3. Sudah melalui code review (lihat `AGENT.md`).
4. Ada observability minimal (log terstruktur + metrik dasar) untuk fitur yang menyentuh uang/data pelanggan.
5. Dokumentasi API/README terkait diperbarui jika ada perubahan kontrak publik.
