# AGENT.md — Panduan Kerja untuk AI Coding Agent

Dokumen ini adalah kontrak kerja untuk **AI coding agent** (mis. Claude Code) maupun kontributor manusia yang mengerjakan repo Vitrin. Baca ini sebelum menyentuh kode. Jika ada konflik antara dokumen ini dan `PRD.md`/`PLAN.md`, dokumen ini yang menang untuk hal-hal teknis/operasional; `PRD.md` yang menang untuk keputusan kebutuhan produk.

---

## 1. Konteks Cepat

- **Produk:** Vitrin — commerce & landing page OS (digital + fisik/COD + membership + afiliasi) untuk pasar Indonesia.
- **Baca dulu:** `PRD.md` (kenapa fitur ini ada), `PLAN.md` (arsitektur & fase roadmap).
- **Arsitektur:** modular monolith (NestJS) + Next.js frontend, multi-tenant row-level, event-driven untuk proses async (lihat `PLAN.md` §1, §3).
- **Prioritas fase saat ini:** cek `PLAN.md` §5 untuk tahu fase mana yang sedang berjalan sebelum mengerjakan fitur Tier 2/3 — jangan bangun fitur di luar fase aktif tanpa konfirmasi.

---

## 2. Prinsip Umum Saat Mengerjakan Kode

1. **Jangan menebak kebutuhan bisnis.** Kalau acceptance criteria di `PRD.md` ambigu untuk task yang diminta, tulis asumsi secara eksplisit di PR description, jangan diam-diam memilih interpretasi yang paling mudah dikerjakan.
2. **Jalur uang adalah jalur paling sensitif di repo ini.** Modul `payment`, `order`, `payout`, `risk-scoring` butuh test coverage tinggi dan review ekstra hati-hati. Jangan pernah "sederhanakan" logika di modul ini demi kecepatan.
3. **Semua integrasi eksternal (PSP, WhatsApp, ekspedisi) wajib lewat adapter/interface**, bukan panggilan SDK vendor langsung tersebar di business logic. Interface: `PaymentProvider`, `MessagingProvider`, `ShippingProvider` (lihat `PLAN.md` §3).
4. **Idempotency wajib** untuk semua handler webhook (payment, shipping status, WA delivery status). Gunakan idempotency key dari provider + unique constraint di DB.
5. **Skema block page builder itu data, bukan HTML statis.** Jangan simpan halaman sebagai HTML mentah di database utama (kecuali dalam mode HTML/JS custom eksplisit yang memang didesain untuk itu) — lihat `PLAN.md` §4 (`pages.blocks JSONB`).
6. **Output AI generatif tidak boleh auto-publish** ke halaman publik, deskripsi produk, atau keputusan fraud tanpa titik konfirmasi manusia, kecuali task secara eksplisit meminta perubahan pada aturan itu dan disetujui product owner.

---

## 3. Konvensi Kode

- **Bahasa:** TypeScript di seluruh layer (frontend, backend, packages bersama). Hindari `any` — gunakan `unknown` + narrowing atau tipe eksplisit.
- **Struktur modul backend (NestJS):** setiap domain (`product`, `order`, `payment`, dst.) punya folder sendiri di `services/api/src/modules/<domain>` berisi `controller`, `service`, `dto`, `entity/schema`, `*.spec.ts`. Jangan taruh logic bisnis di controller — controller hanya orkestrasi request/response.
- **Naming:**
  - File: `kebab-case.ts`
  - Class/Interface: `PascalCase`
  - Variabel/fungsi: `camelCase`
  - Konstanta global: `UPPER_SNAKE_CASE`
  - Tabel DB: `snake_case` jamak (mis. `order_items`)
- **Penanganan uang:** simpan nominal sebagai integer (mis. rupiah dalam satuan terkecil atau minimal `numeric`/`decimal`, **jangan `float`**) untuk menghindari rounding error.
- **Tanggal/waktu:** simpan UTC di database, konversi ke WIB/WITA/WIT hanya di layer presentasi.
- **Format & lint:** jalankan `pnpm lint` dan `pnpm format` sebelum membuat PR; CI akan menolak PR yang gagal lint.
- **Bahasa UI vs kode:** UI default Bahasa Indonesia (lihat `PRD.md` §9 i18n); nama variabel/kode tetap Bahasa Inggris untuk konsistensi dengan ekosistem library.

---

## 4. Alur Kerja Git & PR

1. Branch dari `main`: `feat/<nama-fitur>`, `fix/<nama-bug>`, `chore/<...>`.
2. Commit message mengikuti **Conventional Commits**: `feat(order): tambah risk scoring dasar`, `fix(payment): perbaiki idempotency webhook xendit`.
3. Setiap PR wajib:
   - Deskripsi singkat: masalah, solusi, asumsi yang diambil (lihat §2.1).
   - Link ke user story terkait di `PRD.md` (mis. "Implements US-06").
   - Checklist: test ditambahkan/diperbarui, dokumentasi diperbarui bila kontrak API berubah, tidak ada secret ter-commit.
4. PR ke modul `payment`, `order`, `payout`, `risk-scoring`, `iam` **wajib** review manusia sebelum merge — AI agent tidak boleh merge sendiri PR di area ini meskipun CI hijau.
5. PR di luar area sensitif boleh di-merge setelah CI hijau + minimal satu approval (manusia atau agent lain sesuai kebijakan tim).

---

## 5. Testing — Definition of Done per Fitur

Ikuti `PLAN.md` §7 dan §10. Ringkasnya, sebelum menandai task selesai:

- [ ] Unit test untuk business logic baru/berubah.
- [ ] Integration test jika menyentuh adapter eksternal (pakai sandbox/mock resmi, **jangan** memanggil API produksi vendor dalam test otomatis).
- [ ] E2E test diperbarui jika mengubah alur checkout digital/COD/afiliasi.
- [ ] Tidak ada penurunan coverage pada modul sensitif (`payment`, `order`, `risk-scoring`).
- [ ] Berjalan lokal dengan `pnpm test` tanpa error sebelum push.

---

## 6. Keamanan — Non-Negotiable

- **Jangan pernah commit** API key, token, connection string, atau kredensial apa pun. Gunakan `.env` (di-gitignore) dan secret manager di CI/CD.
- **Jangan simpan data kartu kredit** di database Vitrin sama sekali — selalu tokenisasi via PSP (kepatuhan PCI-DSS SAQ-A, lihat `PRD.md` §9).
- Data pribadi pelanggan (nama, alamat, no. HP) tunduk UU PDP — jangan log data ini secara mentah di log aplikasi (mask/redact sebelum logging).
- Endpoint publik (Storefront API, webhook receiver) wajib rate-limited dan tervalidasi signature/HMAC dari provider (PSP, WA, ekspedisi) sebelum diproses.
- Saat menambah dependency baru, cek lisensi & reputasi package; hindari package dengan maintenance yang mati untuk area sensitif (payment, crypto, auth).

---

## 7. Panduan Tugas Umum

### 7.1 Menambah Payment Provider Baru
1. Implementasikan interface `PaymentProvider` (`createPayment`, `verifyWebhook`, `getStatus`, `refund` jika didukung) di `services/api/src/modules/payment/providers/<nama-provider>/`.
2. Tambahkan test integration terhadap sandbox provider.
3. Registrasikan provider di config, jangan hardcode pemilihan provider di business logic — gunakan factory/strategy pattern.
4. Update `README.md` env vars & `PLAN.md` §2 tabel stack bila ini jadi provider utama baru (bukan sekadar eksperimen).

### 7.2 Menambah Block Baru di Page Builder
1. Definisikan skema block baru di `packages/block-schema/` (versi skema, field, validasi).
2. Tambahkan renderer block di `apps/web` (storefront renderer) dan editor UI-nya di dashboard builder.
3. Pastikan backward-compatible: halaman lama yang belum pakai block ini tidak boleh rusak.
4. Jika block ini akan jadi target AI Page Builder (generate otomatis), tambahkan juga prompt/template generation untuk block tersebut di modul `ai`.

### 7.3 Mengubah Alur Risk-Scoring COD
Ini area sensitif — **selalu** sertakan reviewer manusia dari tim Product/Trust & Safety, bukan cuma engineer.
1. Perubahan pada `risk-scoring` service butuh eksplanasi faktor skor yang jelas (bukan model black-box tanpa alasan yang bisa ditelusuri) — selaras dengan prinsip human-in-the-loop di `PRD.md` §8.6.
2. Tambahkan test kasus untuk skenario false-positive (order sah ditolak) dan false-negative (order fraud lolos).
3. Jangan pernah auto-block order secara permanen tanpa jalur banding/manual review.

### 7.4 Menambah Endpoint Publik (Storefront API / MCP)
1. Setiap endpoint publik baru wajib punya contract test (lihat `PLAN.md` §7) karena dikonsumsi headless frontend maupun agent AI pihak ketiga.
2. Dokumentasikan di OpenAPI/Swagger — jangan biarkan endpoint publik tanpa dokumentasi.
3. Pertimbangkan: endpoint ini akan dipanggil oleh AI agent lain (agentic commerce, `PRD.md` D4) — pastikan response terstruktur (bukan hanya HTML) dan error message jelas/machine-readable.

---

## 8. Yang TIDAK Boleh Dilakukan Agent Tanpa Konfirmasi Eksplisit

- Mengubah skema database yang berdampak pada tabel `orders`, `payments`, `payouts` tanpa migration plan & review manusia.
- Menghapus/mengubah adapter provider yang sedang dipakai di production.
- Mengurangi cakupan test pada modul sensitif untuk "mempercepat" PR.
- Menambahkan fitur di luar fase aktif roadmap (`PLAN.md` §5) tanpa konfirmasi product owner.
- Mengubah kebijakan auto-publish AI (§2.6) atau auto-decision fraud (§7.3) menjadi lebih longgar tanpa persetujuan eksplisit.
- Memanggil API pihak ketiga versi produksi (bukan sandbox) dari dalam test otomatis atau CI.

---

## 9. Referensi Cepat

| Butuh tahu... | Lihat |
|---|---|
| Kenapa fitur ini ada / prioritas bisnis | `PRD.md` |
| Arsitektur, stack, roadmap fase, skema data | `PLAN.md` |
| Cara jalankan proyek secara lokal | `README.md` |
| Struktur folder repo | `README.md` §Struktur Repo |
| Aturan kerja, testing, keamanan (dokumen ini) | `AGENT.md` |
