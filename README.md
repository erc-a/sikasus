# Sistem Informasi Satu (SIKASUS)

Sistem Informasi Satu (SIKASUS) adalah platform modern untuk mengelola informasi pekerja dan kasus di Perusahaan. Aplikasi ini menyediakan antarmuka yang intuitif untuk mencari, menampilkan, dan mengelola data pekerja serta kasus-kasus terkait.

## Fitur Utama

- 🔐 Sistem autentikasi yang aman
- 🔍 Pencarian pekerja berdasarkan PN atau nama
- 👥 Tampilan detail informasi pekerja
- 📋 Manajemen kasus pekerja
- 🎨 Antarmuka pengguna yang responsif
- 🌐 Integrasi dengan Google Sheets

## Teknologi yang Digunakan

- **Frontend:**
  - React + Vite
  - Tailwind CSS
  - Axios

- **Backend:**
  - Node.js
  - Express
  - Google Sheets API

## Persyaratan Sistem

- Node.js v16 atau lebih tinggi
- npm v8 atau lebih tinggi

## Cara Instalasi

1. Clone repository:
```bash
git clone [URL_REPOSITORY]
```

2. Install dependencies untuk frontend:
```bash
cd sikasus
npm install
```

3. Install dependencies untuk backend:
```bash
cd ../backend
npm install
```

4. Setup environment variables:
   - Salin `.env.example` menjadi `.env` di folder frontend
   - Salin `.env.example` menjadi `.env` di folder backend
   - Sesuaikan nilai-nilai variabel sesuai kebutuhan

## Cara Menjalankan Aplikasi

### Development Mode

1. Jalankan backend:
```bash
cd backend
npm run dev
```

2. Jalankan frontend:
```bash
cd sikasus
npm run dev
```

### Production Mode

1. Build frontend:
```bash
cd sikasus
npm run build
```

2. Jalankan backend:
```bash
cd backend
npm start
```

## Struktur Folder

```
sikasus/
├── backend/             # Server-side code
│   ├── credentials.json # Google Sheets credentials
│   ├── server.js       # Express server
│   └── googleSheets.js # Google Sheets integration
├── src/
│   ├── components/     # React components
│   ├── config/        # Configuration files
│   ├── services/      # API services
│   └── utils/         # Utility functions
└── public/            # Static assets
```

## Environment Variables

### Frontend (.env)
- `VITE_API_URL`: URL backend API
- `VITE_ADMIN_USERNAME`: Username admin
- `VITE_ADMIN_PASSWORD`: Password admin

### Backend (.env)
- `PORT`: Port server (default: 5000)
- `GOOGLE_SHEETS_ID`: ID Google Sheets
- `GOOGLE_CREDENTIALS`: Path ke credentials.json

## Deployment

1. Build frontend:
```bash
cd sikasus
npm run build
```

2. Deploy folder `dist` ke web server

3. Setup backend:
   - Pastikan environment variables sudah dikonfigurasi
   - Jalankan server menggunakan process manager (pm2)
```bash
npm install -g pm2
pm2 start server.js
```

## Keamanan

- Gunakan HTTPS di production
- Jangan simpan kredensial di repository
- Selalu gunakan environment variables untuk data sensitif
- Update dependencies secara berkala

## Kontribusi

Untuk berkontribusi pada proyek ini:
1. Fork repository
2. Buat branch baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## Lisensi

Hak Cipta © 2025 Sistem Informasi Satu. Seluruh hak cipta dilindungi undang-undang.
