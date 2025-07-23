import React from 'react';

const Footer = ({ className = '' }) => {
  return (
    <footer className={`bg-[#00529C] ${className}`}>
      <div className="container mx-auto px-4">
        <p className="text-white text-sm text-center">
          © 2025 Sistem Informasi Satu. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
