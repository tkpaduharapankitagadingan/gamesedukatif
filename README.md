# Portal Mini Games Edukatif (APE) - TK Paud Harapan Kita Gadingan

Repositori resmi **Portal Alat Permainan Edukatif (APE) Digital** untuk **TK Paud Harapan Kita Gadingan**.

- **Subdomain Utama (Produksi)**: `https://games.tkpaduharapankitagadingan.sch.id`
- **Subdomain Alias (Redirect 301)**: `https://game.tkpaduharapankitagadingan.sch.id` $\rightarrow$ otomatis diarahkan (`HTTP 301 Moved Permanently`) ke `https://games.tkpaduharapankitagadingan.sch.id`
- **Situs Utama Sekolah**: `https://tkpaduharapankitagadingan.sch.id/`

> **Catatan Developer**: Dokumentasi teknis deployment dan konfigurasi DNS / Redirect 301 ini hanya berada di dalam repositori GitHub (`README.md` & `DEPLOYMENT.md`) untuk tim pengembang/IT sekolah dan **tidak ditampilkan** pada antarmuka publik agar tampilan aplikasi tetap 100% ramah anak usia dini.

---

## Daftar Modul Game Edukatif (Kecerdasan Majemuk)

1. **Kebun Pintar (Kecerdasan Naturalis & Kognitif Dasar)**
   - *Panen Buah & Warna*: Mencocokkan buah dengan keranjang warna yang sesuai.
   - *Hitung Bunga & Angka*: Mengenal konsep bilangan 1 sampai 5 melalui visual bunga matahari.
   - *Tebak Bentuk Hewan*: Mencocokkan siluet bentuk tubuh hewan kebun.
2. **Nada & Irama Musik (Kecerdasan Musikal)**
   - *Gambang & Piano Ceria*: Bermain tangga nada `Do-Re-Mi-Fa-Sol-La-Si-Do` secara bebas maupun mode *Tirukan Lagu Anak*.
3. **Petualangan Huruf & Suara (Kecerdasan Bahasa / Linguistik)**
   - *Tebak Huruf Awal & Kata*: Mengenal fonik huruf awal (`A - Apel`, `B - Bola`, `G - Gajah`, dll.) dengan panduan suara Bahasa Indonesia.
4. **Kartu Memori Ceria (Kecerdasan Visual-Spasial & Daya Ingat)**
   - *Cocokkan Pasangan Gambar*: Melatih konsentrasi dan memori visual jangka pendek anak.
5. **Kereta Pola & Logika (Kecerdasan Logika-Matematika)**
   - *Lengkapi Gerbong Kereta*: Menyelesaikan urutan pola gambar dan warna pada gerbong kereta api.
6. **Anak Mandiri & Berbagi (Kecerdasan Sosial-Emosional)**
   - *Pilih Sikap Baik*: Simulasi interaktif kebiasaan baik sehari-hari, kemandirian, dan empati.

---

## Menjalankan Secara Lokal (Development)

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server development (port 3000)
npm run dev

# 3. Verifikasi build produksi
npm run build
```

---

## Panduan Deploy ke Vercel & Konfigurasi Redirect 301

Lihat panduan lengkap langkah demi langkah di file **[`DEPLOYMENT.md`](./DEPLOYMENT.md)** untuk:
1. Deploy repositori GitHub ini ke **Vercel**.
2. Menghubungkan DNS (`CNAME`) di panel domain `tkpaduharapankitagadingan.sch.id` (cPanel / Cloudflare).
3. Mengatur **HTTP 301 Permanent Redirect** dari `game.tkpaduharapankitagadingan.sch.id` ke `games.tkpaduharapankitagadingan.sch.id`.
