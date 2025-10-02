// Google Apps Script untuk Pendaftaran GDGOC Universitas Pasundan
// Copy script ini ke Google Apps Script Editor

// Konfigurasi - Ganti dengan ID Google Sheets Anda
const SPREADSHEET_ID = '1smbp4djyZb1PY5bgn3MmiHCFl1OXDivXchQXQPdIdF8';
const SHEET_NAME = 'RegistrasiGDGOC';

// Fungsi untuk handle POST request dari form
function doPost(e) {
  try {
    Logger.log('doPost called');
    Logger.log('e: ' + JSON.stringify(e));

    // Parse data dari request - handle both URL-encoded and direct POST
    let payload;

    if (e && e.parameter && e.parameter.payload) {
      payload = e.parameter.payload;
    } else if (e && e.postData && e.postData.contents) {
      // Parse URL-encoded POST data manually
      const postData = e.postData.contents;
      const payloadMatch = postData.match(/payload=([^&]*)/);
      if (payloadMatch) {
        payload = decodeURIComponent(payloadMatch[1]);
      }
    }

    Logger.log('payload length: ' + (payload ? payload.length : 0));

    const data = JSON.parse(payload);
    Logger.log('Parsed data: ' + JSON.stringify({nama: data.nama, npm: data.npm}));

    // Buka spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // Kalau sheet belum ada, buat baru dengan header
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp',
        'Nama Lengkap',
        'NPM',
        'Fakultas',
        'Program Studi',
        'Departemen',
        'Nomor WhatsApp',
        'CV Link',
        'Portofolio Link',
        'Bukti Discord Link',
        'Bukti Bevy Link',
        'Status'
      ]);

      // Format header
      const headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
    }

    // Handle file uploads ke Google Drive
    Logger.log('Starting file uploads...');
    const cvLink = data.cv ? uploadFileToDrive(data.cv, data.nama, 'CV') : '';
    Logger.log('CV uploaded: ' + cvLink);

    const portofolioLink = data.portofolio ? uploadFileToDrive(data.portofolio, data.nama, 'Portofolio') : '';
    Logger.log('Portofolio uploaded: ' + portofolioLink);

    const discordLink = data.discord ? uploadFileToDrive(data.discord, data.nama, 'Discord') : '';
    Logger.log('Discord uploaded: ' + discordLink);

    const bevyLink = data.bv ? uploadFileToDrive(data.bv, data.nama, 'Bevy') : '';
    Logger.log('Bevy uploaded: ' + bevyLink);

    // Tambah data ke sheet
    Logger.log('Adding row to sheet...');
    const rowData = [
      new Date(),
      data.nama,
      data.npm,
      data.fakultas,
      data.prodi,
      data.department,
      data.whatsapp,
      cvLink,
      portofolioLink,
      discordLink,
      bevyLink,
      'Pending'
    ];
    Logger.log('Row data: ' + JSON.stringify(rowData));

    sheet.appendRow(rowData);
    Logger.log('Row added successfully');

    // Auto-resize columns
    sheet.autoResizeColumns(1, 12);
    Logger.log('Columns resized');

    // Send email notification (optional)
    sendEmailNotification(data);

    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Pendaftaran berhasil disimpan'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString(),
        'stack': error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fungsi untuk handle GET request (untuk form submission)
function doGet(e) {
  // If has payload parameter, process as form submission
  if (e && e.parameter && e.parameter.payload) {
    return doPost(e);
  }

  // Otherwise return API status
  return ContentService
    .createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'GDGOC Registration API is running'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Fungsi untuk upload file ke Google Drive
function uploadFileToDrive(fileData, nama, fileType) {
  try {
    // Decode base64 file
    const blob = Utilities.newBlob(
      Utilities.base64Decode(fileData.data),
      fileData.mimeType,
      fileData.name
    );

    // Buat folder GDGOC kalau belum ada
    const parentFolder = DriveApp.getRootFolder();
    let gdgocFolder;
    const folders = parentFolder.getFoldersByName('GDGOC Pendaftaran');

    if (folders.hasNext()) {
      gdgocFolder = folders.next();
    } else {
      gdgocFolder = parentFolder.createFolder('GDGOC Pendaftaran');
    }

    // Buat subfolder untuk peserta
    let pesertaFolder;
    const pesertaFolders = gdgocFolder.getFoldersByName(nama);

    if (pesertaFolders.hasNext()) {
      pesertaFolder = pesertaFolders.next();
    } else {
      pesertaFolder = gdgocFolder.createFolder(nama);
    }

    // Upload file dengan nama yang jelas
    const fileName = `${fileType}_${nama}_${new Date().getTime()}`;
    const file = pesertaFolder.createFile(blob.setName(fileName));

    // Set file sharing ke anyone with link
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return file.getUrl();

  } catch (error) {
    Logger.log('Error uploading file: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

// Fungsi untuk kirim email notifikasi (optional)
function sendEmailNotification(data) {
  try {
    // Ganti dengan email admin GDGOC
    const adminEmail = 'gdsc@unpas.ac.id'; // Ganti ini!

    const subject = `Pendaftaran Baru GDGOC - ${data.nama}`;
    const body = `
      Pendaftaran baru telah diterima:

      Nama: ${data.nama}
      NPM: ${data.npm}
      Fakultas: ${data.fakultas}
      Program Studi: ${data.prodi}
      Departemen: ${data.department}
      WhatsApp: ${data.whatsapp}

      Silakan cek Google Sheets untuk detail lengkap.

      --
      GDGOC Universitas Pasundan
    `;

    // Uncomment untuk aktifkan email
    // MailApp.sendEmail(adminEmail, subject, body);

  } catch (error) {
    Logger.log('Error sending email: ' + error.toString());
  }
}

// Fungsi untuk testing - jalankan ini di Apps Script editor
function testFormSubmission() {
  // Simulasi event object dari POST request
  const testEvent = {
    parameter: {
      payload: JSON.stringify({
        nama: 'Test User',
        npm: '223040001',
        fakultas: 'Teknik',
        prodi: 'Informatika',
        department: 'CURRICULUM WEB',
        whatsapp: '081234567890',
        cv: {
          name: 'test-cv.pdf',
          mimeType: 'application/pdf',
          data: 'JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA2MTIgNzkyXS9Db250ZW50cyA0IDAgUj4+CmVuZG9iago0IDAgb2JqCjw8L0xlbmd0aCA0NT4+CnN0cmVhbQpCVAovRjEgMTIgVGYKMTAwIDcwMCBUZAooVGVzdCBQREYpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKMSAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1szIDAgUl0+PgplbmRvYmoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2EvTmFtZS9GMT4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAxIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4+Pj4KZW5kb2JqCnRyYWlsZXIKPDwvUm9vdCAyIDAgUi9TaXplIDY+PgpzdGFydHhyZWYKMzI3CiUlRU9G'
        },
        discord: {
          name: 'test-discord.jpg',
          mimeType: 'image/jpeg',
          data: '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=='
        },
        bv: {
          name: 'test-bevy.jpg',
          mimeType: 'image/jpeg',
          data: '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=='
        }
      })
    }
  };

  Logger.log('=== STARTING TEST ===');
  const result = doPost(testEvent);
  Logger.log('=== TEST RESULT ===');
  Logger.log(result.getContent());

  return result.getContent();
}

// Fungsi untuk clear semua data registrasi (kecuali header)
function clearAllData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      Logger.log('Sheet tidak ditemukan');
      return 'Sheet tidak ditemukan';
    }

    const lastRow = sheet.getLastRow();

    if (lastRow <= 1) {
      Logger.log('Tidak ada data untuk dihapus');
      return 'Tidak ada data untuk dihapus';
    }

    // Hapus semua row kecuali header (row 1)
    sheet.deleteRows(2, lastRow - 1);

    Logger.log('Berhasil menghapus ' + (lastRow - 1) + ' baris data');
    return 'Berhasil menghapus ' + (lastRow - 1) + ' baris data';

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

// Fungsi untuk clear data berdasarkan NPM tertentu
function clearDataByNPM(npm) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      Logger.log('Sheet tidak ditemukan');
      return 'Sheet tidak ditemukan';
    }

    const data = sheet.getDataRange().getValues();
    let deletedCount = 0;

    // Loop dari bawah ke atas untuk menghindari masalah index
    for (let i = data.length - 1; i >= 1; i--) {
      // Column NPM ada di index 2 (kolom C)
      if (data[i][2] == npm) {
        sheet.deleteRow(i + 1);
        deletedCount++;
      }
    }

    Logger.log('Berhasil menghapus ' + deletedCount + ' baris dengan NPM: ' + npm);
    return 'Berhasil menghapus ' + deletedCount + ' baris dengan NPM: ' + npm;

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}
