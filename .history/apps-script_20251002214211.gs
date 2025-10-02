// Google Apps Script untuk Pendaftaran GDGOC Universitas Pasundan
// Copy script ini ke Google Apps Script Editor

// Konfigurasi - Ganti dengan ID Google Sheets Anda
const SPREADSHEET_ID = '1smbp4djyZb1PY5bgn3MmiHCFl1OXDivXchQXQPdIdF8';
const SHEET_NAME = 'RegistrasiGDGOC';

// Fungsi untuk handle POST request dari form
function doPost(e) {
  try {
    Logger.log('doPost called');
    Logger.log('e.parameter: ' + JSON.stringify(e.parameter));
    Logger.log('e.parameters: ' + JSON.stringify(e.parameters));

    // Parse data dari request
    const payload = e.parameter.payload || e.parameters.payload;
    Logger.log('payload: ' + payload);

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
    const cvLink = data.cv ? uploadFileToDrive(data.cv, data.nama, 'CV') : '';
    const portofolioLink = data.portofolio ? uploadFileToDrive(data.portofolio, data.nama, 'Portofolio') : '';
    const discordLink = data.discord ? uploadFileToDrive(data.discord, data.nama, 'Discord') : '';
    const bevyLink = data.bv ? uploadFileToDrive(data.bv, data.nama, 'Bevy') : '';

    // Tambah data ke sheet
    sheet.appendRow([
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
    ]);

    // Auto-resize columns
    sheet.autoResizeColumns(1, 12);

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

// Fungsi helper untuk testing
function testScript() {
  const testData = {
    nama: 'Test User',
    npm: '123456',
    fakultas: 'Teknik',
    prodi: 'Informatika',
    department: 'Curriculum Web',
    whatsapp: '08123456789'
  };

  Logger.log('Testing with data: ' + JSON.stringify(testData));
}
