<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const teamMembers = ref([]);
const isLoading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/team-members');
    teamMembers.value = response.data.data;
  } catch (err) {
    console.error('Error fetching team members:', err);
    error.value = 'Gagal memuat data anggota kelompok';
    
    // Data fallback jika API gagal
    teamMembers.value = [
      {
        name: 'Muhammad Fauzan',
        nim: '152023081',
        contribution: 'Membuat aplikasi ini (pengembangan utama)'
      },
      {
        name: 'Rizki Yudistira',
        nim: '152023084',
        contribution: 'Memperbaiki frontend'
      },
      {
        name: 'Irsa Nurrohim',
        nim: '152023205',
        contribution: 'Memperbaiki backend'
      }
    ];
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="about">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-3xl font-bold text-center mb-8">Tentang EduTask</h1>
      
      <div class="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Deskripsi Aplikasi</h2>
          <p class="text-gray-700 mb-4">
            EduTask adalah aplikasi manajemen proyek dan tugas yang dirancang khusus untuk kebutuhan pendidikan. 
            Aplikasi ini memungkinkan pengguna untuk membuat proyek, mengelola tugas, dan berkolaborasi dengan tim.
          </p>
          <p class="text-gray-700">
            Fitur utama aplikasi ini meliputi autentikasi JWT, manajemen user dengan multi-role (Admin, Manajer Proyek, Anggota Tim), 
            CRUD proyek dan tugas, pengubahan status tugas, komentar antar anggota pada tugas, dashboard ringkasan, dan edit profil.
          </p>
        </div>
      </div>
      
      <div class="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Teknologi yang Digunakan</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="text-lg font-medium mb-2">Backend</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Laravel (PHP Framework)</li>
                <li>JWT Authentication</li>
                <li>MySQL Database</li>
                <li>RESTful API</li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-medium mb-2">Frontend</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Vue.js</li>
                <li>Tailwind CSS</li>
                <li>Axios untuk HTTP requests</li>
                <li>Vue Router</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Anggota Kelompok</h2>
          
          <div v-if="isLoading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
          
          <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md">
            {{ error }}
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="(member, index) in teamMembers" 
              :key="index"
              class="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 class="text-lg font-medium">{{ member.name }}</h3>
                  <p class="text-gray-600">NIM: {{ member.nim }}</p>
                </div>
                <div class="mt-2 md:mt-0">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Kontribusi
                  </span>
                </div>
              </div>
              <p class="mt-2 text-gray-700">{{ member.contribution }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
