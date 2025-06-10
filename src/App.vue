<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen w-full flex flex-col bg-gray-50">
    <header class="w-full bg-white shadow">
      <div class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <img src="@/assets/logo.svg" alt="EduTask Logo" class="h-8 w-8" />
          <h1 class="text-xl font-bold text-primary">EduTask</h1>
        </div>
        <nav class="flex space-x-4">
          <RouterLink to="/" class="text-gray-600 hover:text-primary">Home</RouterLink>
          <RouterLink to="/login" class="text-gray-600 hover:text-primary">Login</RouterLink>
          <RouterLink to="/register" class="text-gray-600 hover:text-primary">Register</RouterLink>
        </nav>
      </div>
    </header>

    <main class="flex-grow w-full">
      <RouterView />
    </main>

    <footer class="w-full bg-gray-800 text-white py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center">&copy; 2025 EduTask. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Tailwind CSS styles only */
</style>
