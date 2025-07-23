import React from 'react';

const DataDisplay = ({ employee }) => {
  if (!employee) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Informasi Pekerja
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <InfoCard label="PN" value={employee.pn} />
        <InfoCard label="Nama" value={employee.nama} />
        <InfoCard label="Jabatan" value={employee.jabatan} />
        <InfoCard label="Unit" value={employee.unit} />
        <InfoCard label="Lokasi" value={employee.lokasi} />
        <InfoCard label="Status" value={employee.status} />
        <InfoCard label="Divisi" value={employee.divisi} />
        <InfoCard label="Departemen" value={employee.departemen} />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Daftar Kasus
      </h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <p className="text-gray-900 dark:text-white whitespace-pre-line">
          {employee.kasus || 'Tidak ada kasus'}
        </p>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
    <div className="text-blue-500 text-sm mb-1">{label}</div>
    <div className="text-gray-900 dark:text-white">{value || '-'}</div>
  </div>
);

export default DataDisplay;
