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
      range: `${process.env.SHEET_NAME}!A2:I`, // A-I for 9 columns, starting from row 2
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    const employeeMap = new Map();

    rows.forEach((row, index) => {
      // Skip empty rows
      if (!row.some(cell => cell)) return;

      // Kolom: No | PN | Nama | Jabatan | Unit | JG | Branch Office | Tahun Penjatuhan Hukdis | Kasus
      const pn = row[1]?.trim();
      const nama = row[2]?.trim();
      const tahunHukdis = row[7]?.trim();
      const kasus = row[8]?.trim();

      // Skip jika PN kosong
      if (!pn) return;

      const employeeData = {
        no: row[0]?.trim() || '',
        pn: pn,
        nama: nama || '',
        jabatan: row[3]?.trim() || '',
        unit: row[4]?.trim() || '',
        jg: row[5]?.trim() || '',
        branch_office: row[6]?.trim() || '',
      };

      if (employeeMap.has(pn)) {
        // Employee sudah ada, tambahkan kasus dengan tahun spesifik
        const existing = employeeMap.get(pn);
        
        // Tambah kasus dengan tahun spesifik jika ada
        if (kasus && tahunHukdis) {
          existing.daftar_kasus_detail.push({
            kasus: kasus,
            tahun: tahunHukdis
          });
        }
        
        // Tambah tahun ke array untuk info card jika belum ada
        if (tahunHukdis && !existing.tahun_hukdis_array.includes(tahunHukdis)) {
          existing.tahun_hukdis_array.push(tahunHukdis);
        }

        // Tambah kasus ke array untuk backward compatibility
        if (kasus && !existing.kasus_simple.includes(kasus)) {
          existing.kasus_simple.push(kasus);
        }
      } else {
        // Employee baru
        employeeMap.set(pn, {
          ...employeeData,
          daftar_kasus_detail: kasus && tahunHukdis ? [{
            kasus: kasus,
            tahun: tahunHukdis
          }] : [],
          tahun_hukdis_array: tahunHukdis ? [tahunHukdis] : [],
          kasus_simple: kasus ? [kasus] : []
        });
      }
    });

    // Format output
    const employees = Array.from(employeeMap.values()).map(emp => ({
      ...emp,
      tahun_hukdis: emp.tahun_hukdis_array.join(', '), // "2023, 2024, 2025" untuk info card
      kasus: emp.kasus_simple, // untuk backward compatibility
      daftar_kasus: emp.daftar_kasus_detail, // array dengan detail kasus + tahun
      // Hapus array helper
      tahun_hukdis_array: undefined,
      kasus_simple: undefined,
      daftar_kasus_detail: undefined
    }));

    return employees;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
}

module.exports = { getEmployeeData };
