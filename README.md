# Asisten Laporan Harian MagangHub BRIN

Aplikasi lokal untuk menyusun draf laporan harian Bintang Respati Aryananda, S.T. (Teknik Metalurgi, MagangHub BRIN). Hasilnya disalin manual ke [monev.maganghub.kemnaker.go.id](https://monev.maganghub.kemnaker.go.id).

Aplikasi ini tidak login, tidak mengisi absensi, dan tidak mengirim data ke server. Semua riwayat tersimpan di browser lewat `localStorage`.

## Menjalankan di laptop

Cara paling sederhana: buka file `index.html` dengan klik ganda. Tidak perlu instal apa pun.

Kalau ingin lewat server lokal:

```bash
npx serve .
```

Lalu buka alamat yang muncul di terminal, biasanya `http://localhost:3000`.

## Cara pakai

1. Isi tanggal, tiga poin kegiatan (satu baris satu poin), dan pilih lokasi/kegiatan.
2. Tekan **GENERATE LAPORAN**.
3. Periksa tiga draf. Ubah kalimat yang kurang sesuai. Angka di bawah kotak harus minimal 100 karakter.
4. Salin per kolom, atau pakai **Salin Semua**.
5. Tempel manual ke formulir monev.
6. Tekan **Simpan ke Riwayat** bila ingin menyimpan draf di browser ini.
7. Menu **Riwayat** bisa membuka atau menghapus laporan. **Unduh .txt** menyimpan semua laporan yang sudah disimpan.

Pengingat kuning muncul mulai pukul 20.00 WIB.

## Catatan

- Generate ulang pada isian yang sama akan menghasilkan susunan kalimat yang berbeda.
- Draf tidak mengarang angka atau hasil uji.
- Data hilang jika cache situs untuk file atau origin ini dibersihkan. Unduh `.txt` bila ingin salinan di luar browser.
