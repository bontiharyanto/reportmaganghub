# Asisten Laporan Harian MagangHub BRIN

Aplikasi lokal untuk menyusun draf laporan harian Bintang Respati Aryananda, S.T. (Teknik Metalurgi, MagangHub BRIN). Hasilnya disalin manual ke [monev.maganghub.kemnaker.go.id](https://monev.maganghub.kemnaker.go.id).

Aplikasi ini **tidak** login, **tidak** mengisi absensi, dan **tidak** mengirim data ke server. Riwayat tersimpan di browser (`localStorage` pada laptop/PC yang dipakai).

---

## Instalasi di laptop / PC lain

Tidak ada database atau backend. Cukup browser modern (Chrome, Edge, Firefox, atau Safari).

### Yang perlu diinstal

| Kebutuhan | Wajib? | Keterangan |
|-----------|--------|------------|
| Browser | Ya | Versi terbaru disarankan |
| Git | Tidak wajib | Hanya untuk unduh lewat `git clone` |
| Node.js | Tidak wajib | Hanya jika memakai `npx serve` |

### Langkah 1 — Ambil file proyek

**Opsi A — Unduh ZIP (paling mudah)**

1. Buka [github.com/bontiharyanto/reportmaganghub](https://github.com/bontiharyanto/reportmaganghub)
2. Klik **Code** → **Download ZIP**
3. Ekstrak ZIP ke folder, misalnya `Dokumen/reportmaganghub` (Windows) atau `Documents/reportmaganghub` (Mac)

**Opsi B — Git clone**

```bash
git clone https://github.com/bontiharyanto/reportmaganghub.git
cd reportmaganghub
```

### Langkah 2 — Jalankan aplikasi

Pilih **satu** cara di bawah.

#### Cara 1 — Buka langsung (tanpa instal tambahan)

1. Masuk ke folder proyek
2. Klik ganda **`index.html`**
3. Aplikasi terbuka di browser default

Cocok untuk pemakaian cepat di satu laptop.

#### Cara 2 — Server lokal dengan Python (sering sudah ada di Mac/Linux)

Di dalam folder proyek, buka Terminal / PowerShell / CMD:

```bash
cd path/ke/reportmaganghub
python3 -m http.server 8765
```

- **Mac / Linux:** `python3`
- **Windows:** coba `python3` dulu; jika tidak ada, pakai `python -m http.server 8765`

Buka browser: **http://localhost:8765**

Hentikan server dengan `Ctrl+C` di terminal.

#### Cara 3 — Server lokal dengan Node.js

Jika sudah ada Node.js:

```bash
cd path/ke/reportmaganghub
npx serve .
```

Ikuti alamat di terminal (biasanya **http://localhost:3000**).

### Langkah 3 — Cek berhasil

1. Header menampilkan nama, MagangHub BRIN, dan tanggal hari ini
2. Tab **Riwayat** menampilkan contoh **3 hari** jika riwayat masih kosong (demo)
3. Isi tiga poin → **GENERATE LAPORAN** → muncul tiga draf siap salin

---

## Struktur file

```
reportmaganghub/
├── index.html   # Halaman utama
├── style.css    # Tampilan
├── app.js       # Logika & penyimpanan browser
└── README.md    # Panduan ini
```

---

## Cara pakai

1. Isi **tanggal**, **tiga poin** kegiatan (satu baris satu poin), dan **lokasi/kegiatan**
2. Tekan **GENERATE LAPORAN**
3. Periksa tiga draf; ubah yang kurang sesuai. Di bawah kotak harus minimal **100 karakter** (hijau)
4. **Salin** per kolom atau **Salin Semua**
5. Tempel manual ke formulir monev
6. **Simpan ke Riwayat** untuk menyimpan di browser laptop ini
7. **Riwayat** → buka / hapus laporan; **Unduh .txt** untuk salinan file

**Riwayat kosong:** tombol **Muat contoh riwayat (3 hari)** atau buka ulang halaman (contoh dimuat otomatis jika belum ada data).

Banner pengingat monev (kuning) muncul mulai pukul **20.00 WIB**.

---

## Catatan penting

- **Riwayat per browser / per laptop** — pindah PC atau browser baru = riwayat kosong kecuali sudah diunduh `.txt`
- **Bersihkan data situs** di browser bisa menghapus riwayat; backup dengan **Unduh .txt**
- **Generate ulang** pada isian sama menghasilkan susunan kalimat berbeda
- Draf **tidak** mengarang angka atau hasil uji spesifik
- **Jangan** menulis ketidakhadiran di poin kegiatan; aplikasi menyaring frasa seperti itu

---

## Repository

**GitHub:** [bontiharyanto/reportmaganghub](https://github.com/bontiharyanto/reportmaganghub)