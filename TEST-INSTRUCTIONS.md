# Testing Instructions - GDGOC Registration Form

## 🧪 Test di Google Apps Script Editor

### Step 1: Test Function `doGet` (Simple Test)

1. Di Apps Script Editor, di toolbar atas:
   - Dropdown **function** → Pilih **`doGet`**
   - Klik tombol **▶️ Jalankan** (Run)

2. Pertama kali run, akan minta authorization:
   - Klik **Review Permissions**
   - Pilih akun Google Anda
   - Klik **Advanced** → **Go to RegistrasiGDGOC (unsafe)**
   - Klik **Allow**

3. Lihat hasil di **Log eksekusi** (bawah):
   - Harus muncul: `{"status":"success","message":"GDGOC Registration API is running"}`
   - ✅ Kalau sukses, berarti script berjalan dengan baik!

---

## 🌐 Test Form HTML (Real Test)

### Step 1: Buka Form di Browser

1. Buka file `index.html` di browser
2. Isi form dengan data test:

**Data Test:**
```
Nama Lengkap: Test User GDGOC
NPM: 123456789
Fakultas: Teknik
Program Studi: Informatika
Departemen: Curriculum Web (klik card nya)
Nomor WhatsApp: 08123456789

Files:
- CV: Upload PDF file apa saja
- Portofolio: (skip/optional)
- Bukti Discord: Upload gambar/screenshot apa saja
- Bukti BV: Upload gambar/screenshot apa saja
```

### Step 2: Submit Form

1. Klik **Daftar Sekarang**
2. Tunggu beberapa detik (button akan berubah jadi "Mengirim...")
3. Harus muncul popup **"Pendaftaran Berhasil! ✅"** dengan confetti
4. Form akan ter-reset otomatis

### Step 3: Verifikasi di Google Sheets

1. Buka spreadsheet: https://docs.google.com/spreadsheets/d/1smbp4djyZb1PY5bgn3MmiHCFl1OXDivXchQXQPdIdF8/edit
2. Cek sheet **"Pendaftaran"**
3. Harus ada data baru dengan:
   - Timestamp
   - Semua data yang diisi
   - Link ke file-file yang di-upload

### Step 4: Verifikasi di Google Drive

1. Buka [Google Drive](https://drive.google.com)
2. Cari folder **"GDGOC Pendaftaran"**
3. Di dalamnya harus ada subfolder dengan nama peserta
4. Di dalam subfolder harus ada file:
   - `CV_Test User GDGOC_[timestamp].pdf`
   - `Discord_Test User GDGOC_[timestamp].jpg`
   - `BV_Test User GDGOC_[timestamp].jpg`

---

## 🐛 Troubleshooting

### Error: "Terjadi kesalahan saat mengirim data"

**Penyebab:**
- Deployment belum diset "Siapa saja" (Anyone)
- Script belum di-save
- URL salah

**Solusi:**
1. Cek deployment settings → Harus "Siapa saja"
2. Re-deploy dengan New Deployment
3. Update URL di `script.js` dengan URL baru

### Data tidak masuk ke Sheets

**Cek di Apps Script:**
1. Apps Script Editor → **Executions** (icon ⚡ di sidebar kiri)
2. Lihat log eksekusi terakhir
3. Kalau ada error, baca pesan errornya

**Common Errors:**
- `SpreadsheetApp.openById is not defined` → SPREADSHEET_ID salah
- `Permission denied` → Authorization belum di-allow
- `Cannot read property` → Data format salah

### File tidak ter-upload

**Solusi:**
1. Cek ukuran file (max 50MB)
2. Cek format file (PDF untuk CV, image untuk bukti)
3. Cek Apps Script executions untuk error detail

---

## ✅ Success Checklist

Test berhasil kalau:
- [ ] Function `doGet` berjalan tanpa error
- [ ] Form bisa di-submit tanpa error
- [ ] Popup success muncul dengan confetti
- [ ] Data masuk ke Google Sheets
- [ ] File ter-upload ke Google Drive
- [ ] Folder dan subfolder otomatis terbuat
- [ ] Link file di Sheets bisa dibuka

---

## 📝 Test Multiple Times

Untuk test lagi:
1. Refresh halaman `index.html`
2. Isi form dengan data berbeda
3. Submit lagi
4. Cek Sheets → Harus ada row baru

---

## 🎉 Kalau Semua Berhasil

Form sudah siap production! Bisa di-deploy ke:
- GitHub Pages (gratis)
- Netlify (gratis)
- Vercel (gratis)
- Server sendiri

---

## 📞 Debug Tips

Kalau ada masalah, cek berurutan:

1. **Browser Console** (F12):
   ```javascript
   // Lihat error JavaScript
   // Lihat data yang dikirim
   ```

2. **Apps Script Executions**:
   - Lihat semua request yang masuk
   - Lihat error detail
   - Lihat parameter yang diterima

3. **Network Tab** (F12 → Network):
   - Cari request ke `script.google.com`
   - Lihat status code (harus 200/302)
   - Lihat payload yang dikirim

---

Good luck testing! 🚀
