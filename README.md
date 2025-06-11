# EduTask - Project Management System (Frontend)

EduTask adalah sistem manajemen proyek berbasis web yang dirancang khusus untuk lingkungan akademik. Frontend ini dikembangkan dengan Vue 3 dan TypeScript untuk menyediakan antarmuka pengguna yang responsif dan intuitif.

## Fitur Utama

- **Autentikasi User**: Login, registrasi, dan otorisasi dengan JWT
- **Multi-role User**: Antarmuka yang disesuaikan untuk Admin, Manajer Proyek, dan Anggota Tim
- **Manajemen Proyek**: Membuat, melihat, mengedit, dan menghapus proyek
- **Manajemen Tugas**: Pelacakan tugas dengan berbagai status dan prioritas
- **Kolaborasi Tim**: Melihat anggota tim dan peran mereka dalam proyek
- **Visualisasi Progres**: Grafik interaktif dengan Chart.js untuk melacak progres proyek
- **Antarmuka Responsif**: Desain yang berfungsi baik di desktop dan perangkat mobile
- **Notifikasi**: Sistem notifikasi untuk tenggat waktu dan pembaruan

## Teknologi

- Vue 3 dengan Composition API
- TypeScript untuk type safety
- Vite sebagai build tool
- Tailwind CSS untuk styling
- Axios untuk HTTP requests
- Chart.js untuk visualisasi data
- Pinia untuk state management
- Vue Router untuk navigasi

## Struktur Aplikasi

```
src/
├── assets/         # Aset statis (gambar, font, dll)
├── components/     # Komponen Vue yang dapat digunakan kembali
│   ├── charts/     # Komponen visualisasi dengan Chart.js
│   ├── forms/      # Komponen form
│   ├── layout/     # Komponen layout (header, sidebar, dll)
│   └── ui/         # Komponen UI (button, card, dll)
├── router/         # Konfigurasi Vue Router
├── services/       # Layanan untuk API calls dan logika bisnis
├── stores/         # Pinia stores untuk state management
├── types/          # TypeScript type definitions
├── utils/          # Fungsi utilitas
└── views/          # Komponen halaman Vue
```

## Visualisasi Data dengan Chart.js

EduTask menggunakan Chart.js untuk visualisasi data progress proyek:

- **Donut Chart**: Menampilkan persentase progres proyek
- **Warna Dinamis**: Warna chart berubah sesuai status proyek
  - Planning: Biru (#3498db)
  - In Progress: Oranye (#f39c12)
  - Completed: Hijau (#2ecc71)
- **Komponen yang Dapat Digunakan Kembali**: `ProjectProgressChart.vue` dapat digunakan di berbagai bagian aplikasi
- **Interaktif**: Tooltip menampilkan informasi detail saat mouse hover

### Contoh Penggunaan Chart

```vue
<template>
  <ProjectProgressChart 
    :progress="project.progress" 
    :status="project.status"
  />
</template>

<script setup lang="ts">
import ProjectProgressChart from '@/components/ProjectProgressChart.vue'
</script>
```

## Setup Pengembangan

### Prasyarat

- Node.js (versi 16.x atau lebih baru)
- npm atau yarn

### Instalasi

1. Clone repository
   ```
   git clone https://github.com/fauzan3f/edutask-fe.git
   cd edutask-fe
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Jalankan development server
   ```
   npm run dev
   ```

4. Buka browser di `http://localhost:5173`

### Build untuk Production

```
npm run build
```

### Type-Check, Linting, dan Formatting

```
npm run type-check   # Menjalankan TypeScript type checking
npm run lint         # Menjalankan ESLint
```

## Integrasi Backend

Frontend dirancang untuk bekerja dengan API backend EduTask. Pastikan backend telah dijalankan dan dapat diakses. Konfigurasi API endpoint dapat diubah di `src/services/api.ts`.

## Pengembang

- Muhammad Fauzan (Pengembang Aplikasi)
- Rizki Yudistira (Membantu Front End)
- Irsa Nurrohim (Membantu Back End)
