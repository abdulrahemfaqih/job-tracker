# DESIGN SPEC — Job Tracker
## 1. Arah Desain
Utilitarian, monokrom hitam-putih, dan jujur secara fungsional. Ini adalah tools tracking data pribadi, bukan landing page marketing — jadi desainnya harus terasa seperti **alat kerja yang rapi**, bukan promosi. Referensi rasa: dokumen kerja premium (Linear, Notion table view, Things 3) — bukan dashboard SaaS generik penuh warna dan gradient.

**Baca sebagai:** internal tool / personal dashboard untuk data-entry & tracking, audiens tunggal (diri sendiri), bahasa desain tenang & padat data, condong ke sistem editorial monokrom minim dekorasi.

## 2. Larangan Keras (Hindari AI Slop)
Supaya tidak terasa "bikinan AI generik", AI agent WAJIB menghindari:
- Gradient apa pun (terutama ungu/biru khas AI-generated hero).
- Glassmorphism / efek kaca buram berlebihan.
- Shadow tebal default Tailwind (`shadow-md`, `shadow-lg`, `shadow-xl`). Kalau perlu shadow, pakai yang sangat halus (`0 1px 2px rgba(0,0,0,0.04)`).
- `rounded-full` untuk container besar, card, atau tombol utama. Border-radius kecil dan konsisten saja (4–8px).
- Warna latar terang/besar (biru, hijau, merah cerah) untuk section besar.
- Font default tanpa pertimbangan (Inter dipakai asal, tanpa hierarki jelas).
- Emoji sebagai pengganti ikon.
- Ikon generik yang asal comot tanpa keseragaman stroke-width.
- Label ALL CAPS berlebihan, eyebrow text di atas tiap heading, meta text yang dipisah titik tengah ("A · B · C").
- Copy klise ala AI: "Elevate", "Seamless", "Unleash", "Next-Gen", "Boost your productivity". Gunakan bahasa lugas, bahasa Indonesia natural, sesuai konteks job hunting.
- Tiga kartu fitur simetris sempurna sebagai filler kosong — setiap elemen harus punya fungsi data nyata.

## 3. Palet Warna (Strict Black & White)
Tidak ada warna aksen selain hitam/putih/abu-abu. Status memakai variasi **kegelapan abu**, bukan warna-warni.

| Token | Hex | Pemakaian |
|---|---|---|
| `--bg` | `#FFFFFF` | Latar utama |
| `--surface` | `#FAFAFA` | Card, table row alternate |
| `--border` | `#E5E5E5` | Garis pembatas, outline input |
| `--border-strong` | `#111111` | Border tombol utama, focus ring |
| `--text-primary` | `#111111` | Teks utama (bukan `#000` murni, biar tidak terlalu keras) |
| `--text-secondary` | `#6B6B6B` | Teks sekunder, label, meta |
| `--text-muted` | `#9A9A9A` | Placeholder, disabled |
| `--inverse-bg` | `#111111` | Tombol primer, badge status "penting" |
| `--inverse-text` | `#FFFFFF` | Teks di atas `--inverse-bg` |

**Status badge** dibedakan lewat kombinasi shade abu + weight border + ikon kecil, bukan warna:
- `applied` — abu muda, border tipis
- `screening` / `interview` — abu sedang, border medium
- `offer` / `accepted` — hitam solid, teks putih (paling menonjol)
- `rejected` / `withdrawn` — putih dengan teks abu + strikethrough opsional pada nama posisi

## 4. Tipografi
- **UI & body:** sans-serif geometris/netral — `Geist Sans` atau `Helvetica Neue` sebagai fallback. Next.js: pakai `next/font` (`Geist` dari `next/font/google` atau font lokal).
- **Angka & data (dashboard stat, tanggal, status tag):** monospace — `Geist Mono` atau `JetBrains Mono` — memberi kesan "data", bukan dekorasi.
- **Heading halaman** cukup pakai sans-serif yang sama dengan weight lebih berat (600–700), tidak perlu font serif terpisah — ini tools, bukan editorial magazine.
- Line-height body: 1.6. Line-height heading: 1.2.
- Hindari all-caps kecuali untuk label kecil status badge (`text-xs`, `tracking-wide`).

## 5. Layout & Spacing
- Container utama dashboard: `max-w-6xl`, padding horizontal konsisten `px-6` (mobile) → `px-8` (desktop).
- Grid dashboard: gunakan CSS grid dengan kolom asimetris untuk kartu ringkasan (bukan 3 kartu identik simetris) — misal 1 kartu besar "Total Lamaran" + beberapa kartu kecil per status di sampingnya.
- Spacing antar section: `py-10` sampai `py-16`, jangan terlalu lapang seperti landing page marketing (ini dashboard kerja, densitas data harus terasa cukup).
- Table/list lamaran: baris rapat tapi tetap nyaman dibaca (`py-3` per baris), garis pembatas antar baris `border-b border-[--border]` tipis, tanpa shadow.

## 6. Komponen
**Tombol primer**
- Background `#111111`, teks putih, border-radius 6px, tanpa shadow.
- Hover: `#2A2A2A`. Active: scale 0.98.

**Tombol sekunder / outline**
- Background transparan, border `1px solid var(--border-strong)`, teks `--text-primary`.

**Input & form**
- Border `1px solid var(--border)`, radius 6px, padding cukup (`py-2.5 px-3`).
- Focus state: border berubah ke `--border-strong` + ring tipis, tanpa glow warna.
- Label di atas input, ukuran kecil (`text-sm`), warna `--text-secondary`.

**Card (dashboard stat / job item)**
- Border `1px solid var(--border)`, radius 8px, tanpa shadow default. Shadow hanya muncul halus saat hover (opsional, `0 2px 8px rgba(0,0,0,0.04)`).

**Status badge**
- Bentuk pill kecil (`rounded-full` khusus untuk badge kecil ini saja — pengecualian dari larangan rounded-full di atas karena ini elemen kecil, bukan container besar), `text-xs uppercase tracking-wide`, sesuai mapping shade di bagian 3.

**Table lamaran (list view)**
- Kolom: Perusahaan, Posisi, Status (badge), Tanggal Apply, Update Terakhir, Aksi.
- Baris bisa diklik untuk masuk ke detail. Aksi edit/hapus muncul saat hover (ikon, bukan tombol besar tiap baris) untuk menjaga tampilan tetap bersih.

**Ikon**
- Pakai satu keluarga ikon konsisten dengan stroke-width seragam (mis. Phosphor Icons atau Radix Icons), stroke width 1.5–2. Jangan campur beberapa library ikon.

## 7. Halaman & Wireframe Kasar
### Login
```
┌───────────────────────────────┐
│           JOB TRACKER          │
│                                 │
│   Email     [______________]   │
│   Password  [______________]   │
│                                 │
│   [        Masuk        ]      │
│                                 │
│   Belum punya akun? Daftar     │
└───────────────────────────────┘
```
Centered card, max-w-sm, tanpa ilustrasi dekoratif — cukup judul + form.

### Register
Sama seperti Login, tambah field Nama. Setelah submit sukses → auto-login → redirect ke Dashboard.

### Dashboard
```
┌─────────────────────────────────────────────┐
│ Job Tracker            [+ Tambah Lamaran]    │
├─────────────────────────────────────────────┤
│ [Total: 24]  [Interview: 5]  [Offer: 1] ...  │
├─────────────────────────────────────────────┤
│ Perlu Follow-up (>14 hari tanpa update)      │
│ - PT Sekawan Media · Backend Dev · 18 hari   │
├─────────────────────────────────────────────┤
│ Lamaran Terbaru                              │
│ [table ringkas 5 baris terakhir]             │
└─────────────────────────────────────────────┘
```

### Daftar Lamaran (List/Table View)
Full table dengan search bar + filter status di atasnya, sort by kolom header.

### Detail / Edit Lamaran
Form yang sama dengan form tambah, terisi data existing, tombol "Simpan Perubahan" dan "Hapus Lamaran" (destructive, teks merah-abu bukan merah cerah, dengan dialog konfirmasi).

## 8. Motion (Seperlunya Saja)
- Tidak perlu animasi scroll-reveal (ini bukan landing page).
- Transisi halus hanya pada: hover tombol/card (150–200ms), buka/tutup dialog konfirmasi hapus, toast notifikasi sukses/gagal.
- Hormati `prefers-reduced-motion`.

## 9. Aksesibilitas
- Kontras teks minimum WCAG AA terhadap latar putih.
- Semua form punya `<label>` yang terasosiasi, bukan hanya placeholder.
- Focus ring terlihat jelas (bukan `outline-none` tanpa pengganti).
- Konfirmasi sebelum aksi destruktif (hapus lamaran).
