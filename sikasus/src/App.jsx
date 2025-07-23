import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { employeeService } from './services/api';
import { auth } from './utils/auth';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

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

  const handleLogin = (username, password) => {
    if (auth.login(username, password)) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    auth.logout();
    setIsLoggedIn(false);
    setSelectedEmployee(null);
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 0) {
      const filtered = employees.filter(emp => 
        emp.pn?.toLowerCase().includes(value.toLowerCase()) ||
        emp.nama?.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
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
            <h2 className="text-xl font-semibold text-[#00529C] mb-4">Sistem Informasi Satu</h2>
            <p className="text-[#00529C]/70 text-sm">
              Platform modern untuk informasi pekerja dan kasus
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleLogin(e.target.username.value, e.target.password.value);
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
              © 2025 Sistem Informasi Satu. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF5FF] flex flex-col">
      <Header className="sticky top-0 z-50 border-b border-[#00529C] shadow-md py-4" onLogout={handleLogout} userName="Eric Arwido Damanik" />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#00529C] mb-2">Sistem Informasi Satu</h1>
          <p className="text-[#00529C]/70">Platform modern untuk informasi pekerja dan kasus</p>
          
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Masukkan PN/Nama Pekerja"
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={() => setShowSuggestions(true)}
                className="w-full px-4 py-2 bg-white border border-[#00529C] text-[#00529C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00529C]"
              />
              <button
                onClick={() => {
                  const found = employees.find(emp => 
                    emp.pn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    emp.nama?.toLowerCase().includes(searchQuery.toLowerCase())
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
                <div className="text-[#00529C] text-sm mb-1">Lokasi</div>
                <div className="text-gray-900">{selectedEmployee.lokasi}</div>
              </div>
              <div className="bg-white border border-[#00529C] p-4 rounded-lg">
                <div className="text-[#00529C] text-sm mb-1">Status</div>
                <div className="text-gray-900">{selectedEmployee.status}</div>
              </div>
              <div className="bg-white border border-[#00529C] p-4 rounded-lg">
                <div className="text-[#00529C] text-sm mb-1">Divisi</div>
                <div className="text-gray-900">{selectedEmployee.divisi}</div>
              </div>
              <div className="bg-white border border-[#00529C] p-4 rounded-lg">
                <div className="text-[#00529C] text-sm mb-1">Departemen</div>
                <div className="text-gray-900">{selectedEmployee.departemen}</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#00529C] mb-4">Daftar Kasus</h2>
            <div className="bg-white border border-[#00529C] p-4 rounded-lg">
              {(() => {
                // Pastikan kasus selalu dalam bentuk array
                let kasusList = Array.isArray(selectedEmployee.kasus) ? 
                  selectedEmployee.kasus : 
                  (selectedEmployee.kasus ? [selectedEmployee.kasus] : []);
                
                // Filter out empty kasus
                kasusList = kasusList.filter(kasus => kasus && kasus.trim());

                if (kasusList.length === 0) {
                  return <p className="text-[#00529C]">Tidak ada kasus</p>;
                }

                return (
                  <div className="space-y-4">
                    {kasusList.map((kasus, index) => (
                      <div 
                        key={index} 
                        className={`${
                          index !== kasusList.length - 1 ? 'border-b border-[#00529C]/20 pb-4 mb-4' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-[#FF6B00] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <div className="flex-grow">
                            <p className="text-gray-900 whitespace-pre-line">
                              {typeof kasus === 'string' ? kasus : kasus.deskripsi || kasus}
                            </p>
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
