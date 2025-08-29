import React from 'react';

const DataDisplay = ({ employee }) => {
  if (!employee) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Informasi Pekerja
      </h2>
      <div className="flex flex-wrap gap-4 mb-8">
        {[ 
          employee.pn && employee.pn !== '-' && { label: 'PN', value: employee.pn },
          employee.nama && employee.nama !== '-' && { label: 'Nama', value: employee.nama },
          employee.jabatan && employee.jabatan !== '-' && { label: 'Jabatan', value: employee.jabatan },
          employee.unit && employee.unit !== '-' && { label: 'Unit Kerja', value: employee.unit },
          employee.jg && employee.jg !== '-' && { label: 'JG', value: employee.jg },
          employee.branch_office && employee.branch_office !== '-' && { label: 'Branch Office', value: employee.branch_office },
          employee.tahun_hukdis && employee.tahun_hukdis !== '-' && { label: 'Tahun Penjatuhan Hukdis', value: employee.tahun_hukdis }
        ].filter(Boolean).map((item, idx) => (
          <div className="w-full md:basis-1/3" key={idx}>
            <InfoCard label={item.label} value={item.value} />
          </div>
        ))}
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
