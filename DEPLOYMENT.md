# Panduan Deployment Vercel & Konfigurasi Subdomain Redirect 301

Dokumen ini ditujukan khusus untuk **Developer / Administrator IT TK Paud Harapan Kita Gadingan** di repositori GitHub. Panduan ini menjelaskan cara men-deploy portal APE ke **Vercel** serta mengaktifkan **HTTP 301 Redirect** dari `game.tkpaduharapankitagadingan.sch.id` ke `games.tkpaduharapankitagadingan.sch.id`.

---

## 1. Arsitektur Kompatibilitas Vercel & Redirect 301 di Kode

Repositori ini sudah dikonfigurasi secara penuh agar langsung kompatibel dengan Vercel tanpa perlu mengubah kode saat deploy:

1. **`vercel.json`**:
   Mendaftarkan aturan `redirects` di level Vercel Edge Network sehingga setiap request yang masuk dengan header host `game.tkpaduharapankitagadingan.sch.id` langsung diarahkan secara permanen (`"permanent": true` / **HTTP 301**) ke `https://games.tkpaduharapankitagadingan.sch.id/:path*`.
2. **`middleware.ts` (Next.js Edge Middleware)**:
   Lapisan pengaman kedua pada aplikasi Next.js yang memeriksa header `x-forwarded-host` / `host`. Jika bernilai `game.tkpaduharapankitagadingan.sch.id`, middleware mengembalikan `NextResponse.redirect(destinationUrl, 301)` lengkap dengan path dan query parameter.
3. **`next.config.ts`**:
   Menggunakan `output: process.env.VERCEL ? undefined : 'standalone'` sehingga saat di-build oleh Vercel (di mana variabel `VERCEL=1` aktif otomatis), Next.js menggunakan pipeline serverless/edge native Vercel yang optimal, sekaligus tetap mendukung mode `standalone` di container lain.

---

## 2. Langkah Deploy dari GitHub ke Vercel

1. Push kode repositori ini ke akun **GitHub** Anda.
2. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik **Add New...** $\rightarrow$ **Project**.
3. Pilih repositori GitHub **Portal Game APE TK Paud Harapan Kita Gadingan** lalu klik **Import**.
4. Pada bagian **Build and Output Settings**, biarkan pengaturan default Next.js:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
5. Klik **Deploy** dan tunggu hingga proses build selesai (~1 menit).

---

## 3. Mengatur Subdomain & Redirect 301 di Vercel Dashboard

Setelah project berhasil ter-deploy di Vercel:

1. Masuk ke project Anda di Vercel Dashboard $\rightarrow$ tab **Settings** $\rightarrow$ menu **Domains**.
2. **Tambahkan Subdomain Utama**:
   - Ketik `games.tkpaduharapankitagadingan.sch.id` lalu klik **Add**.
3. **Tambahkan Subdomain Alias (Untuk Redirect 301)**:
   - Ketik `game.tkpaduharapankitagadingan.sch.id` lalu klik **Add**.
   - Klik **Edit** pada `game.tkpaduharapankitagadingan.sch.id`:
     - Pilih opsi **Redirect to Another Domain**.
     - Pilih status **`301 Moved Permanently`** (atau biarkan terhubung ke production branch karena `vercel.json` dan `middleware.ts` sudah memaksa status `301 Moved Permanently`).
     - Pilih target domain: `games.tkpaduharapankitagadingan.sch.id`.
     - Klik **Save**.

---

## 4. Konfigurasi DNS (`tkpaduharapankitagadingan.sch.id`) di cPanel / Cloudflare

Login ke panel manajemen DNS domain sekolah (`tkpaduharapankitagadingan.sch.id` — biasanya di **cPanel Zone Editor** atau **Cloudflare DNS**), lalu tambahkan **2 CNAME Record** berikut:

| Type    | Name / Host | Target / Value (Points To) | TTL  | Proxy Status (Jika Cloudflare) |
| :------ | :---------- | :------------------------- | :--- | :----------------------------- |
| `CNAME` | `games`     | `cname.vercel-dns.com`     | Auto | DNS Only (Awan Abu-abu)        |
| `CNAME` | `game`      | `cname.vercel-dns.com`     | Auto | DNS Only (Awan Abu-abu)        |

> **Tips cPanel**: Di cPanel Zone Editor, saat mengisi kolom **Name**, cukup ketik `games` (cPanel akan otomatis melengkapinya menjadi `games.tkpaduharapankitagadingan.sch.id.`). Lakukan hal yang sama untuk `game`.

---

## 5. Cara Verifikasi Redirect 301

Setelah DNS propagasi selesai (biasanya 1–5 menit) dan sertifikat SSL otomatis aktif di Vercel, jalankan perintah berikut di terminal untuk memastikan status **HTTP 301** berjalan:

```bash
curl -I https://game.tkpaduharapankitagadingan.sch.id
```

Output yang diharapkan:

```http
HTTP/2 301
location: https://games.tkpaduharapankitagadingan.sch.id/
```
