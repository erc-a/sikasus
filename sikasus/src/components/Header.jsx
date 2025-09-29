import React, { useState } from 'react';

const Header = ({ className = '', onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`bg-[#00529C] backdrop-blur shadow-sm sticky top-0 z-30 ${className}`}>
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="lg:w-1/4">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Sistem Informasi Kasus Pekerja
          </span>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-center">
          <a 
            href="#" 
            className="relative px-4 py-2 text-white font-medium transition-colors duration-200 hover:text-[#EBF5FF] group"
          >
            <span>Home</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"/>
          </a>
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button
            className="p-2 rounded-lg text-white hover:bg-[#00529C]/80 transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Right Side: User & Logout */}
        <div className="hidden md:flex lg:w-1/4 items-center justify-end space-x-4">
          <span className="font-medium text-white">
            Selamat Datang
          </span>
          <button 
            onClick={onLogout}
            className="bg-[#FF6B00] text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-[#FF6B00]/90 transition-colors duration-200"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${menuOpen ? 'max-h-64' : 'max-h-0'}`}>
        <div className="bg-white border-t border-[#00529C] shadow-sm px-4 py-3 space-y-3">
          <a href="#" className="block text-[#00529C] hover:text-[#00529C]/80 font-medium transition-colors duration-200">
            Home
          </a>
          <div className="flex items-center justify-between pt-2 border-t border-[#00529C]">
            <span className="font-medium text-[#00529C]">
              Selamat Datang
            </span>
            <button 
              onClick={onLogout}
              className="bg-[#FF6B00] text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-[#FF6B00]/90 transition-colors duration-200"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
