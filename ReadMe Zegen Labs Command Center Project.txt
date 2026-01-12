Zegen Labs Internship - Command Center Project

Proyek ini adalah aplikasi manajemen data (CRUD) sederhana yang dibangun sebagai tantangan teknis untuk posisi Internship Fullstack Developer di Zegen Labs, Aplikasi ini mencakup sistem autentikasi JWT, manajemen state dengan TanStack Query, dan database permanen berbasis File System (JSON).

#Teknologi yang Digunakan

Frontend:
- **React + Vite** (TypeScript)
- **TanStack Table (v8)**: Untuk manajemen tabel yang efisien (Search, Filter, Pagination).
- **TanStack Query (v5)**: Untuk fetching data dan manajemen loading state.
- **Tailwind CSS**: Untuk styling antarmuka bertema *Cyberpunk/Dark Mode*.
- **Lucide React**: Untuk set ikon aplikasi.

Backend:
- **Node.js + Express**
- **JSON Web Token (JWT)**: Untuk keamanan autentikasi.
- **Swagger UI Express**: Untuk dokumentasi API yang interaktif.
- **FS (File System)**: Sebagai database permanen (Data tidak hilang saat server restart).

Fitur Utama
1.  Secure Login**: Autentikasi menggunakan JWT dengan pemisahan role (Admin & User).
2.  Persistent Database**: Menggunakan file JSON untuk menyimpan data sehingga tetap ada meskipun server dimatikan.
3.  Advanced Table: 
    - Global Search (Pencarian data).
    - Filter Kategori (Perbaikan logika agar "All Categories" menampilkan semua data).
    - Pagination (Sistem navigasi sektor data).
4.  Loading & Error State**: Tampilan transisi yang halus saat proses sinkronisasi data.
5.  Swagger Documentation**: Dokumentasi API lengkap di endpoint `/api-docs`.

Kredensial Akun (Testing)
Gunakan akun di bawah ini untuk masuk ke Command Center:

| Role  | Username | Password |
|       |          |          |
| Admin |  admin   | admin123 |
| User  | user     | user123  |


Cara Menjalankan Proyek

1. Persiapan Backend
```bash
cd backend
npm install
node server.js