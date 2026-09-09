# PRD — Job Tracker

## 1. Ringkasan Produk
Job Tracker adalah aplikasi web personal untuk mencatat dan memantau lamaran pekerjaan yang sudah diajukan, lengkap dengan status/progress-nya, dari "applied" sampai hasil akhir (diterima/ditolak).

## 2. Latar Belakang & Masalah
Saat melamar ke banyak posisi sekaligus, mudah kehilangan jejak: perusahaan mana yang sudah dilamar, sudah sampai tahap apa, kapan interview, siapa kontak HR-nya. Spreadsheet manual berantakan dan tidak enak dilihat. Job Tracker menggantikannya dengan tempat pencatatan terstruktur, cepat diisi, dan enak dipantau.

## 3. Tujuan Produk
- Mencatat setiap lamaran kerja dengan detail yang relevan.
- Melacak status/progress tiap lamaran secara jelas.
- Menyediakan ringkasan (dashboard) atas seluruh lamaran yang sedang berjalan.
- Data privat per akun (autentikasi wajib).

## 4. Target Pengguna
Job seeker aktif yang melamar ke banyak perusahaan dalam periode yang sama — fresh graduate, career switcher, atau siapa pun yang sedang aktif mencari kerja.

## 5. Lingkup Fitur (v1)

### 5.1 Autentikasi
- Register: nama, email, password.
- Login: email, password.
- Logout.
- Password di-hash (bcrypt/argon2), tidak pernah disimpan plain text.
- Session/JWT-based auth, semua halaman dashboard & CRUD adalah protected route.
- Validasi dasar: format email, panjang minimum password, email harus unik.

### 5.2 Dashboard
- Ringkasan angka: total lamaran, jumlah per status.
- Breakdown visual sederhana per status (bisa bar chart tipis, tetap monokrom — lihat DESIGN.md).
- Daftar lamaran terbaru (misal 5 terakhir diupdate).
- Highlight lamaran yang sudah lama tidak ada update (misal >14 hari tanpa perubahan status) sebagai penanda "perlu di-follow-up".
- Quick action: tombol "Tambah Lamaran".

### 5.3 CRUD Lamaran Kerja
**Field data lamaran:**
| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| company_name | text | ya | nama perusahaan |
| position | text | ya | posisi yang dilamar |
| status | enum | ya | applied, screening, interview, offer, accepted, rejected, withdrawn |
| applied_date | date | ya | tanggal apply |
| source | text | tidak | LinkedIn, Jobstreet, referral, dll |
| job_url | url | tidak | link lowongan |
| salary_range | text | tidak | ekspektasi/penawaran gaji |
| location | text | tidak | kota |
| work_type | enum | tidak | WFO / WFH / Hybrid |
| notes | textarea | tidak | catatan bebas (hasil interview, kontak HR, dll) |

**Aksi:**
- Create — form tambah lamaran baru.
- Read — daftar (table/list) + halaman detail per lamaran.
- Update — edit data & ubah status dari halaman detail atau inline dari list.
- Delete — hapus lamaran (dengan konfirmasi).

**Pendukung:**
- Search berdasarkan nama perusahaan / posisi.
- Filter berdasarkan status.
- Sort berdasarkan tanggal apply atau tanggal update terakhir.

### 5.4 Riwayat Status (opsional, stretch goal v1.1)
Setiap kali status berubah, dicatat sebagai entri riwayat (timeline) agar user bisa melihat perjalanan satu lamaran dari awal sampai akhir.

## 6. Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Database:** Turso (libSQL / SQLite edge database) — via `@libsql/client` atau Drizzle ORM
- **Auth:** custom credentials-based (bcrypt + JWT session, cookie httpOnly) — boleh pakai Auth.js/NextAuth dengan Credentials Provider jika lebih cepat diimplementasikan
- **Deployment target:** Vercel (opsional, tidak wajib bagian dari scope build)

> Catatan: jika yang dimaksud "Torso" adalah nama lain, mohon dikonfirmasi ke AI agent — dokumen ini mengasumsikan **Turso**.

## 7. Skema Database (draft)

```
users
- id            (pk, text/uuid)
- name          (text)
- email         (text, unique)
- password_hash (text)
- created_at    (datetime)

job_applications
- id            (pk, text/uuid)
- user_id       (fk -> users.id)
- company_name  (text)
- position      (text)
- status        (text enum: applied|screening|interview|offer|accepted|rejected|withdrawn)
- applied_date  (date)
- source        (text, nullable)
- job_url       (text, nullable)
- salary_range  (text, nullable)
- location      (text, nullable)
- work_type     (text enum: wfo|wfh|hybrid, nullable)
- notes         (text, nullable)
- created_at    (datetime)
- updated_at    (datetime)

-- opsional (stretch goal)
status_history
- id                    (pk)
- job_application_id    (fk -> job_applications.id)
- status                (text)
- changed_at            (datetime)
```

Semua query pada `job_applications` **wajib** difilter dengan `user_id` milik user yang sedang login — tidak boleh ada kebocoran data antar user.

## 8. User Flow Utama
1. User membuka situs → belum login → diarahkan ke halaman Login.
2. User baru → klik "Daftar" → isi form register → otomatis login → masuk Dashboard.
3. User lama → Login → masuk Dashboard.
4. Dari Dashboard, klik "Tambah Lamaran" → isi form → simpan → muncul di daftar lamaran.
5. Dari daftar, klik satu lamaran → halaman detail → edit status/data → simpan.
6. Hapus lamaran dari halaman detail atau list (dengan dialog konfirmasi).
7. Logout dari mana saja lewat navigasi utama.

## 9. Non-Functional Requirements
- Responsif penuh (mobile-first — sering update status dari HP saat di jalan/setelah interview).
- Loading cepat (SSR/RSC Next.js, hindari waterfall fetch yang tidak perlu).
- Data privat per user (row-level filtering by user_id di setiap query).
- Aksesibilitas dasar: kontras warna cukup, label form jelas, semua elemen interaktif bisa diakses keyboard.
- Form validation di client & server side.

## 10. Out of Scope (v1)
- Reminder/notifikasi email atau push.
- Integrasi kalender otomatis.
- Kolaborasi multi-user pada satu akun.
- Import otomatis dari LinkedIn/spreadsheet.
- Statistik lanjutan (rata-rata waktu per tahap, dsb).

## 11. Kriteria Sukses
- User bisa menambahkan satu lamaran baru dalam < 30 detik.
- Dashboard menampilkan ringkasan tanpa loading terasa lambat.
- Tidak ada kebocoran data antar akun (diverifikasi lewat testing manual).
- Alur register → login → tambah data → lihat dashboard berjalan mulus tanpa bug blocking.
