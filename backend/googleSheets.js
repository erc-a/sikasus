const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function getEmployeeData() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${process.env.SHEET_NAME}!A2:J`, // A-J for 10 columns, starting from row 2
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    const processedEmployees = new Map();
    let currentPN = null;

    rows.forEach(row => {
      // Skip empty rows
      if (!row.some(cell => cell)) return;

      const pn = row[1]?.trim();
      const nama = row[2]?.trim();
      const kasus = row[9]?.trim();

      // If row has PN and Nama, it's a new employee
      if (pn && nama) {
        currentPN = pn;
        processedEmployees.set(currentPN, {
          no: row[0]?.trim() || '',
          pn: pn,
          nama: nama,
          status: row[3]?.trim() || '',
          jabatan: row[4]?.trim() || '',
          unit: row[5]?.trim() || '',
          lokasi: row[6]?.trim() || '',
          divisi: row[7]?.trim() || '',
          departemen: row[8]?.trim() || '',
          kasus: kasus ? [kasus] : []
        });
      } 
      // If row only has kasus, add it to current employee
      else if (kasus && currentPN) {
        const employee = processedEmployees.get(currentPN);
        if (employee) {
          employee.kasus.push(kasus);
        }
      }
    });

    return Array.from(processedEmployees.values());
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
}

module.exports = { getEmployeeData };
