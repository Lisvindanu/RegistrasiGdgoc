# Setup Guide - Form Pendaftaran GDGOC Universitas Pasundan

Panduan lengkap untuk setup form pendaftaran dengan Google Sheets dan Google Drive.

---

## 📋 Prerequisites

- Akun Google (Gmail)
- Browser modern (Chrome/Firefox/Edge)
- Basic knowledge tentang Google Sheets

---

## 🚀 Setup Step-by-Step

### 1️⃣ Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **+ Blank** untuk buat spreadsheet baru
3. Rename spreadsheet jadi: `GDGOC Pendaftaran 2025`
4. Copy **Spreadsheet ID** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID_INI]/edit
   ```
   Contoh: `1abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

---

### 2️⃣ Setup Google Apps Script

1. Di spreadsheet, klik **Extensions** → **Apps Script**
2. Hapus code default yang ada
3. Buka file `apps-script.gs` dari project ini
4. Copy semua code dari file tersebut
5. Paste ke Apps Script Editor
6. **PENTING:** Ganti konfigurasi di baris 5-6:
   ```javascript
   const SPREADSHEET_ID = 'PASTE_SPREADSHEET_ID_DISINI';
   const SHEET_NAME = 'Pendaftaran';
   ```
7. (Opsional) Ganti email admin di baris 107:
   ```javascript
   const adminEmail = 'email-admin@gdgoc.com';
   ```
8. Klik **💾 Save** (Ctrl/Cmd + S)
9. Rename project jadi: `RegistrasiGDGOC`

---

### 3️⃣ Deploy Web App

1. Di Apps Script Editor, klik **Deploy** → **New deployment**
2. Klik ⚙️ icon (gear/settings) di samping "Select type"
3. Pilih **Web app**
4. Isi konfigurasi:
   - **Description:** `GDGOC Registration Form v1`
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone` ⚠️ PENTING!
5. Klik **Deploy**
6. Klik **Authorize access**
7. Pilih akun Google Anda
8. Klik **Advanced** → **Go to RegistrasiGDGOC (unsafe)**
9. Klik **Allow**
10. **Copy Web App URL** yang muncul:
    ```
    https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
    ```

---

### 4️⃣ Update JavaScript Configuration

1. Buka file `script.js` di project
2. Cari baris 220:
   ```javascript
   this.scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Ganti dengan URL Web App yang sudah di-copy:
   ```javascript
   this.scriptURL = 'https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec';
   ```
4. Save file

---

### 5️⃣ Testing

1. Buka `index.html` di browser
2. Isi form dengan data test:
   - Nama: Test User
   - NPM: 123456
   - Fakultas: Pilih salah satu
   - Prodi: Informatika
   - Departemen: Pilih salah satu
   - Upload file dummy (PDF untuk CV, gambar untuk Discord/BV)
   - Nomor WA: 08123456789
3. Klik **Daftar Sekarang**
4. Tunggu sampai muncul popup success
5. Cek Google Sheets - data harus muncul di sheet "Pendaftaran"
6. Cek Google Drive - harus ada folder "GDGOC Pendaftaran" dengan subfolder sesuai nama

---

## 📁 Struktur Google Drive

Setelah ada pendaftaran, struktur folder di Google Drive:

```
📁 GDGOC Pendaftaran/
  📁 Test User/
    📄 CV_Test User_1234567890.pdf
    📄 Portofolio_Test User_1234567890.pdf (optional)
    📄 Discord_Test User_1234567890.png
    📄 BV_Test User_1234567890.png
  📁 John Doe/
    📄 CV_John Doe_1234567891.pdf
    ...
```

---

## 📊 Struktur Google Sheets

Sheet "Pendaftaran" akan memiliki kolom:

| Timestamp | Nama Lengkap | NPM | Fakultas | Program Studi | Departemen | Nomor WhatsApp | CV Link | Portofolio Link | Bukti Discord Link | Bukti BV Link | Status |
|-----------|--------------|-----|----------|---------------|------------|----------------|---------|-----------------|-------------------|---------------|--------|
| 2025-10-02 21:00 | Test User | 123456 | Teknik | Informatika | Curriculum Web | 08123456789 | [Link] | [Link] | [Link] | [Link] | Pending |

---

## 🔧 Troubleshooting

### Error: "Script function not found: doPost"
- Pastikan code di Apps Script sudah benar di-copy
- Pastikan sudah save (Ctrl/Cmd + S)
- Coba deploy ulang

### Error: "Authorization required"
- Re-authorize Apps Script
- Pastikan "Who has access" = **Anyone**

### Data tidak masuk ke Sheets
- Cek console browser (F12) untuk error
- Pastikan `SPREADSHEET_ID` benar
- Pastikan `scriptURL` di `script.js` sudah benar

### File tidak ter-upload
- Cek ukuran file (max 50MB untuk Google Drive)
- Pastikan format file benar (PDF untuk CV, image untuk bukti)

---

## 📧 Email Notification (Optional)

Untuk aktifkan email notification saat ada pendaftaran baru:

1. Di `apps-script.gs`, uncomment baris 114:
   ```javascript
   MailApp.sendEmail(adminEmail, subject, body);
   ```
2. Ganti `adminEmail` di baris 107 dengan email admin
3. Save dan deploy ulang

---

## 🎨 Customization

### Ubah Departemen
Edit di `index.html` baris 104-137 (department cards)

### Ubah Fakultas
Edit di `index.html` baris 71-82 (select options)

### Ubah Warna Tema
Edit di `styles.css`:
- Primary color: `#4285f4` (Google Blue)
- Success color: `#34a853` (Google Green)
- Warning color: `#fbbc05` (Google Yellow)
- Error color: `#ea4335` (Google Red)

---

## 📱 Deployment ke Web

### Deploy ke GitHub Pages (Gratis)

1. Buat repository di GitHub
2. Upload semua file
3. Settings → Pages
4. Source: `main` branch
5. Website akan live di: `https://username.github.io/repository-name/`

### Deploy ke Netlify (Gratis)

1. Buat akun di [netlify.com](https://netlify.com)
2. Drag & drop folder project
3. Website akan live dalam beberapa detik

---

## 🔐 Security Notes

⚠️ **PENTING:**

- Jangan share Spreadsheet ID atau Deployment URL ke publik
- File upload tersimpan di Google Drive Anda
- Data peserta bersifat sensitif, jaga kerahasiaannya
- Backup spreadsheet secara berkala
- Atur permission Google Drive folder dengan hati-hati

---

## 📞 Support

Jika ada masalah atau pertanyaan:

1. Cek dokumentasi di file ini
2. Cek console browser (F12) untuk error
3. Cek Apps Script logs: Apps Script Editor → Executions

---

## 🎉 Selesai!

Form pendaftaran sudah siap digunakan! 🚀

**Testing Checklist:**
- [ ] Form validation bekerja
- [ ] Data masuk ke Google Sheets
- [ ] File ter-upload ke Google Drive
- [ ] Success popup muncul
- [ ] Form ter-reset setelah submit
- [ ] Responsive di mobile

---

© 2025 GDGOC Universitas Pasundan
