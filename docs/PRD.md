# PRD — Vitrin
**All-in-One Commerce & Landing Page OS untuk Kreator dan UMKM Indonesia**

| | |
|---|---|
| Dokumen | Product Requirements Document (PRD) |
| Produk | Vitrin (nama kerja — dari kata "etalase/vitrine") |
| Versi dokumen | 1.0 |
| Tanggal | 4 September 2026 |
| Status | Draft untuk validasi tim |
| Pemilik dokumen | Product Team |

> Catatan asumsi: nama "Vitrin" dan seluruh angka target di bawah adalah **asumsi kerja** yang bisa diganti. Dokumen ini ditulis agar bisa langsung dieksekusi oleh tim produk/desain/engineering maupun AI coding agent (lihat `AGENT.md`).

---

## 1. Ringkasan Eksekutif

Vitrin adalah platform **"landing page + commerce OS"** yang menyatukan empat kategori yang saat ini terpisah di pasar Indonesia:

1. **Link-in-bio & digital product** (kelas Lynk.id)
2. **No-code payment/commerce super-app** (kelas Mayar.id)
3. **COD funnel & checkout engine untuk D2C fisik** (kelas Scalev)
4. **Toko/pemesanan berbasis chat WhatsApp** (kelas "OrderOnline"/WA-commerce)

Alih-alih memilih satu segmen, Vitrin menargetkan seller yang **produknya campuran** (digital + fisik + COD + membership + event) dan seller yang selama ini terpaksa memakai 2–3 tools sekaligus (mis. Lynk.id untuk profil + Scalev untuk COD + WhatsApp manual untuk konfirmasi + Google Sheets untuk rekap). Pembeda utama Vitrin bukan "lebih banyak fitur", melainkan **satu graph data pelanggan-produk-transaksi** yang dipakai bersama oleh page builder, checkout, WhatsApp, AI, dan program afiliasi.

---

## 2. Latar Belakang & Peluang Pasar

- Ekonomi kreator dan UMKM digital Indonesia tumbuh pesat; kanal jualan utama tetap Instagram/TikTok → **link di bio** → **halaman jualan** → **checkout/konfirmasi WhatsApp**.
- Untuk produk digital (ebook, kelas online, template), pasar sudah dilayani baik oleh Lynk.id (fokus kemudahan & personal branding) dan Mayar.id (fokus payment & operasional bisnis lengkap, sudah API-first dengan MCP server untuk agent AI).
- Untuk produk fisik dengan **COD** (dominan di TikTok Shop-adjacent D2C, skincare, fashion, produk kesehatan), Scalev unggul di *checkout engine*, manajemen gudang/ekspedisi, dan halaman custom (HTML mode) — tapi kurang kuat di sisi personal-branding/link-in-bio dan produk digital.
- Untuk seller yang order-taking-nya masih manual via chat ("OrderOnline"-style), operasional sangat bergantung admin manusia: rawan salah catat, RTO (*return to origin*) tinggi, tidak ada data terpusat.
- **Celah pasar**: tidak ada satu platform yang melayani seller "hybrid" (jual produk digital sekaligus fisik/COD, atau punya membership + kelas + produk fisik), dan tidak ada platform lokal yang menjadikan **AI generatif** sebagai inti alur kerja (bukan tempelan) — mulai dari pembuatan halaman, penulisan copy, foto produk, sampai *fraud-scoring* COD.
- Tren baru yang relevan untuk 2026+: **agentic commerce** — agen AI (Claude, ChatGPT, dll.) mulai bisa bertransaksi atas nama pengguna. Mayar sudah menyediakan MCP server; Scalev punya Storefront API yang eksplisit didesain untuk headless checkout. Vitrin harus API-first & agent-ready sejak V1, bukan ditambahkan belakangan.

---

## 3. Analisis Kompetitor

| Dimensi | Lynk.id | Mayar.id | Scalev | "OrderOnline" / WA-commerce | **Vitrin (target)** |
|---|---|---|---|---|---|
| Fokus utama | Link-in-bio + produk digital + afiliasi | No-code commerce super-app (digital, fisik, membership, event, donasi) | COD funnel & checkout engine untuk D2C fisik | Katalog & pemesanan lewat chat WhatsApp | Commerce OS terpadu: digital + fisik + COD + membership dalam 1 storefront |
| Kekuatan | Sangat mudah, gratis untuk mulai, payout otomatis tgl 25 | API lengkap, banyak metode bayar, CRM, MCP server, integrasi luas | Checkout khusus COD (ongkir real-time, varian, bundle), HTML mode custom page, Storefront API headless | Sudah ada di mana pelanggan berada (WhatsApp), tanpa app baru | Satu data model lintas produk; AI generatif inti alur kerja; agent-commerce ready |
| Kelemahan | Terbatas untuk produk fisik/COD; kustomisasi desain minim | Bukan spesialis funnel COD/high-conversion landing page | Kurang kuat untuk produk digital/personal branding & afiliasi kreator | Sangat manual, rawan human error, tanpa analitik terpusat | *(perlu dibuktikan lewat MVP)* |
| Model bayar | Gratis + Pro (komisi lebih rendah) | Biaya transaksi/langganan | Langganan (SaaS) + biaya transaksi payment gateway | Bervariasi/manual | Freemium + biaya transaksi + tier langganan (lihat §11) |
| Target user | Kreator personal, UMKM pemula | Kreator, edukator, event organizer, SaaS kecil | D2C ads-driven, growth marketer, tim performance ads | Warung/UMKM chat-first | Seller hybrid: kreator + D2C + reseller army |

**Kesimpulan strategis:** Vitrin tidak bersaing head-to-head di setiap fitur individual, tapi menang di **integrasi lintas kategori** + **AI sebagai jalur pintas ke hasil** (bukan fitur tambahan) + **kesiapan agentic commerce**.

---

## 4. Target Pengguna & Persona

1. **Kreator Hybrid — "Kak Sari"**: jual kelas online *dan* produk skincare fisik dengan COD. Sekarang pakai Lynk.id untuk kelas + Scalev untuk skincare + WA manual untuk komunitas member. Butuh satu dashboard.
2. **UMKM D2C Ads-Driven — "Bang Rian"**: jalankan iklan TikTok/Meta ke landing page COD, volume 200–2.000 order/bulan, sangat sensitif terhadap RTO dan kecepatan konfirmasi order.
3. **Edukator/Coach — "Pak Yusuf"**: jual kelas + membership berlangganan + sesi konsultasi berbayar, butuh drip content dan manajemen member, bukan hanya checkout sekali beli.
4. **Reseller/Afiliasi — "Dewi"**: tidak punya produk sendiri, jualan ulang produk kreator lain, butuh halaman jualan otomatis dari katalog seller yang dia ikuti, dengan tracking komisi transparan.
5. **Operator UMKM (admin toko) — "Tim CS Toko Bunga"**: mengelola order masuk dari WhatsApp/Instagram, butuh konfirmasi COD cepat, anti fraud, dan sinkron ke ekspedisi.

---

## 5. Positioning & Fitur Pembeda (Differentiators)

**Positioning statement:**
> "Untuk seller Indonesia yang produknya tidak cuma satu jenis, Vitrin adalah satu-satunya platform yang menyatukan landing page, checkout (digital/fisik/COD), WhatsApp commerce, dan AI generatif dalam satu data terpadu — sehingga seller tidak perlu lagi menyambung 3–4 tools yang berbeda."

Fitur pembeda diprioritaskan menjadi 3 tingkat:

### 5.1 Tier 1 — Wajib ada di MVP (pembeda inti)
| # | Fitur | Kenapa membedakan |
|---|---|---|
| D1 | **Unified Product & Cart Engine** — satu keranjang bisa berisi produk digital, fisik-COD, fisik-prabayar, dan langganan membership sekaligus | Tidak ada kompetitor yang menyatukan ini secara native |
| D2 | **AI Page Builder** — generate landing page lengkap (copy + struktur + skema warna) dari 1 prompt teks atau voice note WhatsApp | Lynk.id/Mayar butuh isi manual; Scalev butuh setup funnel manual |
| D3 | **WhatsApp-Native Order Confirmation Bot** dengan *risk scoring* COD (skor kombinasi nomor telepon, riwayat RTO, pola IP) | Codify/ScalOrder-style ada di Shopify apps, belum jadi fitur native di platform lokal |
| D4 | **Headless Storefront API + MCP/agent endpoint sejak V1** | Menyongsong agentic commerce; Mayar & Scalev baru mulai ke arah ini |
| D5 | **Block-based No-Code editor + mode HTML/JS pro-code** dalam satu produk | Menjangkau baik non-teknis (seperti Lynk.id) maupun growth marketer teknikal (seperti Scalev) |

### 5.2 Tier 2 — Rilis di 3–6 bulan pertama
| # | Fitur | Kenapa membedakan |
|---|---|---|
| D6 | **Reseller/Afiliasi Marketplace 2 arah** — afiliasi otomatis dapat *microsite* sendiri dari katalog seller yang diikutinya, bukan cuma link tracking | Lynk.id ada afiliasi tapi tanpa halaman otomatis per afiliasi |
| D7 | **Payout instan T+0 via VA** + opsi *working capital advance* (dana talangan) untuk seller volume tinggi | Diferensiasi fintech embedded, belum jadi standar di kompetitor lokal |
| D8 | **Multi-gudang & rate-shopping ekspedisi otomatis** (bandingkan ongkir/SLA lintas kurir per order) | Scalev punya integrasi ekspedisi, tapi rate-shopping otomatis lintas kurir + multi-gudang adalah level lanjutan |
| D9 | **A/B testing landing page bawaan** dengan uji signifikansi statistik otomatis | Fitur growth-marketer yang biasanya butuh tool terpisah (VWO/Optimizely) |
| D10 | **Multi-pixel/CAPI attribution terpadu** (Meta, TikTok, Google) + dashboard atribusi lintas kanal | Sudah ada di beberapa app COD, jadi standar minimum, bukan lagi pembeda murni tapi wajib untuk kompetitif |

### 5.3 Tier 3 — Diferensiasi jangka panjang (6–12 bulan+)
| # | Fitur |
|---|---|
| D11 | LMS drip-content penuh untuk membership/kelas berlangganan |
| D12 | Live-selling pixel sync (TikTok Live/Shopee Live) & scarcity widgets (spin wheel, flash sale countdown) |
| D13 | Jaringan blacklist fraud COD **lintas-merchant** (opt-in, mirip *shared trust graph*) |
| D14 | Kepatuhan pajak otomatis (e-Faktur/PPN) untuk seller UMKM naik kelas ke PKP |
| D15 | Ekspansi cross-border: multi-currency untuk kreator yang menjual ke luar negeri |

---

## 6. Tujuan Produk & Success Metrics

**North Star Metric:** *Gross Merchandise Value (GMV) terverifikasi per bulan yang mengalir lewat Vitrin.*

| Metrik | Target 3 bulan pasca-launch | Target 12 bulan |
|---|---|---|
| Seller aktif (≥1 transaksi/bulan) | 1.000 | 25.000 |
| GMV bulanan | Rp 2 M | Rp 150 M |
| Rasio order COD terkonfirmasi (vs total order masuk) | ≥ 70% | ≥ 85% |
| RTO rate rata-rata seller | Baseline (ukur dulu) | Turun ≥ 30% relatif terhadap baseline |
| Waktu pembuatan landing page pertama (dari sign-up) | < 10 menit (dengan AI builder) | < 5 menit |
| Retensi seller bulan ke-3 | ≥ 40% | ≥ 55% |
| NPS seller | ≥ 30 | ≥ 50 |

---

## 7. Ruang Lingkup

### 7.1 In-scope untuk V1 (MVP)
- Page builder (block + AI generate) dengan custom domain/subdomain.
- Produk: digital (file/link), fisik (COD & prabayar), layanan/booking sederhana.
- Checkout: QRIS, VA/transfer bank, e-wallet, kartu kredit, COD.
- WhatsApp order confirmation (semi-otomatis + bot konfirmasi).
- Dashboard order, inventaris dasar, integrasi 3 ekspedisi utama (JNE, J&T, SiCepat).
- Payout ke rekening bank (T+1) & dashboard pendapatan.
- Program afiliasi dasar (link tracking + komisi).
- API publik (REST) + webhook dasar untuk integrasi eksternal.

### 7.2 Out-of-scope untuk V1 (di roadmap lanjutan)
- LMS drip-content penuh, live-selling sync, working capital advance, multi-currency, blacklist fraud lintas-merchant, e-Faktur otomatis. (lihat §5.3, dan `PLAN.md` untuk fase rilis)

---

## 8. User Stories & Functional Requirements

### 8.1 Modul: Page Builder
- **US-01** Sebagai seller, saya ingin membuat landing page hanya dengan menuliskan deskripsi produk, agar saya tidak perlu desain manual.
  - AI menghasilkan draf: headline, deskripsi, struktur blok (hero, benefit, testimoni, FAQ, CTA), skema warna sesuai kategori produk.
  - Seller bisa edit tiap blok lewat editor drag-and-drop.
- **US-02** Sebagai seller teknikal, saya ingin mode HTML/JS custom agar saya bisa mengontrol setiap piksel halaman saya, sambil tetap terhubung ke data produk/checkout Vitrin (mirip *HTML Mode* Scalev, via `Vitrin.data.get()`/`Vitrin.checkout.*`).
- **US-03** Sebagai seller, saya ingin preview mobile-first karena >85% traffic dari iklan sosial berasal dari mobile.
- **FR:** Editor harus render < 2 detik untuk 90% halaman; AI generate awal < 15 detik.

### 8.2 Modul: Unified Commerce Engine
- **US-04** Sebagai seller, saya ingin menjual produk digital dan fisik dalam satu keranjang checkout yang sama.
- **US-05** Sebagai pembeli, saya ingin memilih metode bayar (termasuk COD) hanya untuk item fisik, sementara item digital otomatis prabayar.
- **FR:** Cart harus mendukung item campuran dengan aturan pembayaran per-jenis-item; kalkulasi ongkir real-time berdasarkan alamat & berat/dimensi.

### 8.3 Modul: WhatsApp Commerce & CRM
- **US-06** Sebagai admin toko, saya ingin order COD terkonfirmasi otomatis lewat bot WA (template terverifikasi Meta), dan hanya masuk antrean manual jika skor risiko tinggi.
- **US-07** Sebagai admin, saya ingin broadcast promo tersegmentasi ke pelanggan lama via WhatsApp API resmi (bukan spam/unofficial API, demi keamanan akun).
- **FR:** Skor risiko dihitung dari: histori RTO nomor, validitas format nomor, kecocokan alamat, kecepatan repeat-order, dan (opsional, opt-in) data blacklist bersama.

### 8.4 Modul: Pembayaran & Payout
- **US-08** Sebagai seller, saya ingin dana hasil penjualan cair otomatis ke rekening saya sesuai jadwal (default T+1, opsi instan T+0 berbayar).
- **FR:** Integrasi PSP agregator (bukan re-invent payment rail sendiri) untuk QRIS/VA/e-wallet/kartu; rekonsiliasi otomatis per transaksi.

### 8.5 Modul: Afiliasi/Reseller
- **US-09** Sebagai afiliasi, saya ingin halaman jualan otomatis dari produk seller yang saya ikuti, dengan komisi ter-tracking transparan per order.
- **FR:** Setiap afiliasi punya *microsite* turunan (child page) dari page induk seller, dengan atribusi cookie + fallback ID berbasis akun.

### 8.6 Modul: AI Generatif (lintas produk)
- **US-10** Sebagai seller, saya ingin AI menuliskan ulang deskripsi produk saya dalam beberapa gaya (persuasif, informatif, storytelling) untuk A/B test.
- **US-11** Sebagai seller, saya ingin AI meningkatkan kualitas foto produk (background removal, upscaling, penataan komposisi dasar).
- **FR:** Semua output AI harus melalui *human review* sebelum publish (tidak auto-publish tanpa konfirmasi seller), dan disclosure bahwa konten dibuat dengan bantuan AI (untuk kepatuhan platform iklan).

### 8.7 Modul: Analitik
- **US-12** Sebagai seller, saya ingin melihat funnel dari klik iklan → landing page → checkout → order terkonfirmasi → pengiriman, dalam satu dashboard.
- **FR:** Integrasi CAPI Meta/TikTok/Google, deduplikasi event, atribusi last-click default dengan opsi model lain di rilis lanjutan.

### 8.8 Modul: Admin Multi-Tenant & Keamanan
- **US-13** Sebagai pemilik bisnis dengan tim, saya ingin memberi akses terbatas (role: admin, CS, finance) ke anggota tim saya.
- **FR:** RBAC granular per modul (produk, order, keuangan, pengaturan toko).

---

## 9. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| Performa | TTFB halaman jualan < 300ms (P75, edge-cached); checkout submit < 1.5s |
| Skalabilitas | Arsitektur multi-tenant, target 100rb+ storefront aktif tanpa isolasi fisik per tenant di awal (row-level tenancy) |
| Keamanan | Enkripsi data at-rest & in-transit, PCI-DSS SAQ-A (tokenisasi via PSP, kartu tidak pernah disimpan langsung), audit trail transaksi |
| Kepatuhan | UU PDP (Perlindungan Data Pribadi), kepatuhan BI/OJK untuk payment gateway (via PSP berlisensi, bukan lisensi sendiri di V1), kebijakan resmi WhatsApp Business API (no spam/unofficial API) |
| Ketersediaan | SLA uptime 99.9% untuk checkout & payment path (jalur kritikal), 99.5% untuk editor/dashboard |
| Aksesibilitas & i18n | Halaman publik minimal WCAG AA dasar; UI Bahasa Indonesia default, Bahasa Inggris opsional |
| Observability | Tracing end-to-end order (dari klik iklan sampai payout), logging terstruktur, alerting untuk kegagalan pembayaran/webhook |

---

## 10. Alur Pengguna Utama (ringkas)

1. **Onboarding seller:** daftar → pilih jenis produk (digital/fisik/campuran) → AI builder tanya 3–5 pertanyaan → halaman jadi → hubungkan metode bayar & (opsional) WhatsApp Business.
2. **Pembelian produk fisik COD:** pembeli klik iklan → landing page → isi form checkout minimal (nama, alamat, no. HP) → sistem skor risiko → jika rendah risiko: order langsung terkonfirmasi + notifikasi WA; jika tinggi risiko: bot WA minta konfirmasi tambahan.
3. **Pembelian produk digital:** pembeli checkout → bayar (QRIS/VA/e-wallet/kartu) → akses produk instan (link/file/kelas) dikirim otomatis via email & WA.
4. **Afiliasi:** afiliasi daftar ke program seller → dapat microsite otomatis → share link → transaksi tercatat → komisi otomatis masuk saldo afiliasi → payout terjadwal.

---

## 11. Model Bisnis & Monetisasi

| Tier | Target | Harga (indikatif) | Ambil untung dari |
|---|---|---|---|
| **Gratis** | Kreator pemula, validasi ide | Rp 0/bulan | Biaya transaksi lebih tinggi (mis. 3–5%) |
| **Pro** | Seller aktif reguler | Rp 99rb–299rb/bulan | Biaya transaksi lebih rendah (mis. 1.5–2.5%) + fitur AI/A-B test |
| **Scale** | UMKM volume tinggi, tim CS | Rp 499rb–1,5jt/bulan | Fitur multi-gudang, RBAC tim, payout instan, API rate limit lebih tinggi |
| **Enterprise/API** | Brand besar, integrator | Custom | SLA khusus, akses penuh headless API/MCP, dedicated support |

Tambahan revenue stream: biaya payout instan (T+0), biaya working capital advance (bunga/fee), marketplace afiliasi (potongan kecil dari komisi lintas-seller), add-on AI generation di luar kuota.

---

## 12. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Ketergantungan pada WhatsApp Business API (kebijakan Meta berubah) | Tinggi | Desain arsitektur messaging abstrak (adapter pattern) agar bisa tambah kanal lain (Telegram, SMS) |
| Kompetitor incumbent (Mayar/Scalev) menambah fitur serupa dengan cepat | Sedang | Fokus pada *data terpadu lintas kategori* yang sulit direplikasi cepat karena butuh migrasi arsitektur besar |
| Fraud COD & RTO tinggi merusak kepercayaan ekspedisi/PSP | Tinggi | Risk scoring sejak V1, monitoring RTO per seller, rate-limiting seller dengan RTO ekstrem |
| Kompleksitas kepatuhan pembayaran (lisensi, PPN, dsb.) | Tinggi | Gunakan PSP berlisensi sebagai perantara, jangan pegang lisensi payment sendiri di tahap awal |
| Adopsi AI builder rendah (seller tidak percaya hasil AI) | Sedang | Selalu human-in-the-loop, tampilkan preview & alasan rekomendasi AI, bukan black-box |
| Scope creep (mencoba jadi "segalanya" sejak awal) | Tinggi | Disiplin pada scope V1 (§7.1), fitur Tier 2/3 dikunci ke roadmap, lihat `PLAN.md` |

---

## 13. Milestone Rilis (ringkas — detail di `PLAN.md`)

| Fase | Fokus | Estimasi durasi |
|---|---|---|
| Fase 0 | Discovery, validasi, arsitektur | 3–4 minggu |
| Fase 1 (MVP) | Page builder + unified commerce + WA order + payment dasar | 12–14 minggu |
| Fase 2 | AI generatif penuh, afiliasi marketplace, payout instan, multi-gudang | 10–12 minggu |
| Fase 3 | A/B testing, atribusi multi-pixel, LMS, live-selling sync | 10–12 minggu |
| Fase 4 | Agentic commerce penuh (MCP publik), ekspansi fintech & cross-border | Berkelanjutan |

---

## 14. Lampiran — Glosarium

- **COD**: Cash on Delivery, bayar di tempat saat barang tiba.
- **RTO**: Return to Origin, paket dikembalikan karena gagal terkirim/ditolak.
- **PSP**: Payment Service Provider/agregator (mis. Xendit, Midtrans).
- **CAPI**: Conversions API, jalur server-to-server untuk data konversi ke platform iklan.
- **MCP**: Model Context Protocol, standar agar AI agent bisa memakai tools/data eksternal secara terstruktur.
- **Headless/Storefront API**: API yang memungkinkan frontend/checkout custom dibangun di atas backend Vitrin.
- **Agentic commerce**: transaksi yang diinisiasi/dieksekusi oleh AI agent atas instruksi pengguna.
