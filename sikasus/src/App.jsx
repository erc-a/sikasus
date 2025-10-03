import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { employeeService, authService } from './services/api';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());

  useEffect(() => {
    if (isLoggedIn) {
      fetchEmployeeData();
    }
  }, [isLoggedIn]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      console.log('Response dari server:', data);
      setEmployees(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal mengambil data dari server: ' + err.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      await authService.login(username, password);
      setIsLoggedIn(true);
    } catch (error) {
      alert('Login gagal: ' + error.message);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setSelectedEmployee(null);
    setSearchQuery('');
    setSuggestions([]);
  };

    const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value) {
      const filtered = employees.filter(emp => 
        emp.pn?.toLowerCase().includes(value.toLowerCase()) ||
        emp.nama?.toLowerCase().includes(value.toLowerCase()) ||
        emp.tahun_hukdis?.toLowerCase().includes(value.toLowerCase()) ||
        emp.daftar_kasus?.some(kasusDetail => 
          kasusDetail.kasus.toLowerCase().includes(value.toLowerCase()) ||
          kasusDetail.tahun.toLowerCase().includes(value.toLowerCase())
        )
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (employee) => {
    console.log('Detail employee yang dipilih:', employee);
    setSearchQuery(employee.nama);
    setSelectedEmployee(employee);
    setShowSuggestions(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EBF5FF]">
        <div className="bg-white p-8 rounded-xl shadow-lg w-[450px] border-t-4 border-[#00529C] relative">
          {/* Header section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#00529C] mb-2">Selamat Datang</h1>
            <h2 className="text-xl font-semibold text-[#00529C] mb-4">Sistem Informasi Kasus Pekerja</h2>
            <p className="text-[#00529C]/70 text-sm">
              Platform modern untuk informasi pekerja dan kasus
            </p>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            await handleLogin(e.target.username.value, e.target.password.value);
          }}
          className="space-y-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-[#00529C] mb-2 font-medium">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    placeholder="Masukkan username anda"
                    className="w-full px-4 py-3 border border-[#00529C]/30 rounded-lg text-[#00529C] 
                             focus:ring-2 focus:ring-[#00529C] focus:border-transparent
                             placeholder:text-[#00529C]/40 transition-all duration-200
                             hover:border-[#00529C]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#00529C] mb-2 font-medium">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="Masukkan password anda"
                    className="w-full px-4 py-3 border border-[#00529C]/30 rounded-lg text-[#00529C] 
                             focus:ring-2 focus:ring-[#00529C] focus:border-transparent
                             placeholder:text-[#00529C]/40 transition-all duration-200
                             hover:border-[#00529C]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00529C] text-white py-3 rounded-lg
                       hover:bg-[#00529C]/90 transition-all duration-200 font-medium text-lg"
            >
              Masuk
            </button>
          </form>

          {/* Footer text */}
          <div className="mt-6 text-center">
            <p className="text-[#00529C]/60 text-sm">
              © 2025 Sistem Informasi Kasus Pekerja. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF5FF] flex flex-col">
  <Header className="sticky top-0 z-50 border-b border-[#00529C] shadow-md py-4" onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#00529C] mb-2">Sistem Informasi Kasus Pekerja</h1>
          <p className="text-[#00529C]/70">Platform modern untuk informasi pekerja dan kasus</p>
          
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Masukkan PN/Nama/Tahun/Kasus untuk mencari"
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={() => setShowSuggestions(true)}
                className="w-full px-4 py-2 bg-white border border-[#00529C] text-[#00529C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00529C]"
              />
              <button
                onClick={() => {
                  const found = employees.find(emp => 
                    emp.pn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    emp.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    emp.tahun_hukdis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    emp.daftar_kasus?.some(kasusDetail => 
                      kasusDetail.kasus.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      kasusDetail.tahun.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  );
                  setSelectedEmployee(found || null);
                  setShowSuggestions(false);
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF6B00] text-white px-4 py-1 rounded-md hover:bg-[#FF6B00]/90"
              >
                Search
              </button>
              
              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute w-full mt-1 bg-white border border-[#00529C] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {suggestions.map((emp) => (
                    <div
                      key={emp.pn}
                      onClick={() => handleSelectSuggestion(emp)}
                      className="px-4 py-2 hover:bg-[#EBF5FF] cursor-pointer text-[#00529C] flex justify-between items-center"
                    >
                      <span>{emp.nama}</span>
                      <span className="text-[#00529C]/70 text-sm">{emp.pn}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : selectedEmployee ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#00529C] mb-6">Informasi Pekerja</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-[#00529C] p-4 rounded-lg">
                <div className="text-[#00529C] text-sm mb-1">PN</div>
                <div className="text-gray-900">{selectedEmployee.pn}</div>
              </div>
              <div className="bg-white border border-[#00529C] p-4 rounded-lg">
                <div className="text-[#00529C] text-sm mb-1">Nama</div>
                <div className="text-gray-900">{selectedEmployee.nama}</div>
              </div>
              <div className="bg-white border border-[#00529C] p-4 rounded-lg">
                <div className="text-[#00529C] text-sm mb-1">Jabatan</div>
                <div className="text-gray-900">{selectedEmployee.jabatan}</div>
              </div>
              <div className="bg-white border border-[#00529C] p-4 rounded-lg">
                <div className="text-[#00529C] text-sm mb-1">Unit</div>
                <div className="text-gray-900">{selectedEmployee.unit}</div>
              </div>
              <div className="bg-white border border-[#00529C] p-4 rounded-lg">
                <div className="text-[#00529C] text-sm mb-1">JG</div>
                <div className="text-gray-900">{selectedEmployee.jg}</div>
              </div>
              <div className="bg-white border border-[#00529C] p-4 rounded-lg">
                <div className="text-[#00529C] text-sm mb-1">Branch Office</div>
                <div className="text-gray-900">{selectedEmployee.branch_office}</div>
              </div>
              <div className="bg-white border border-[#00529C] p-4 rounded-lg">
                <div className="text-[#00529C] text-sm mb-1">Tahun Penjatuhan Hukdis</div>
                <div className="text-gray-900">{selectedEmployee.tahun_hukdis}</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#00529C] mb-4">Daftar Kasus</h2>
            <div className="bg-white border border-[#00529C] p-4 rounded-lg">
              {(() => {
                // Gunakan daftar_kasus yang memiliki detail kasus + tahun spesifik
                let kasusList = selectedEmployee.daftar_kasus || [];
                
                if (kasusList.length === 0) {
                  return (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                      <div className="text-gray-500">Tidak ada kasus</div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {kasusList.map((kasusDetail, index) => (
                      <div key={index} className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                        <div className="flex items-start space-x-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {kasusDetail.kasus} (Tahun: {kasusDetail.tahun})
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            Silakan masukkan PN atau Nama Pekerja untuk mencari
          </div>
        )}
      </main>
      <Footer className="py-6 text-center text-sm font-poppins" />
    </div>
  );
}

export default App;
