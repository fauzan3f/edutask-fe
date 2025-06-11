<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, computed, ref, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const isDropdownOpen = ref(false)

onMounted(() => {
  // Initialize auth state from localStorage
  authStore.init()
  
  // Add click event listener to close dropdown when clicking outside
  document.addEventListener('click', closeDropdownOnClickOutside)
})

onBeforeUnmount(() => {
  // Remove event listener when component is unmounted
  document.removeEventListener('click', closeDropdownOnClickOutside)
})

const toggleDropdown = (event) => {
  // Stop propagation to prevent the document click handler from firing
  event.stopPropagation()
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdownOnClickOutside = (event) => {
  const dropdown = document.getElementById('user-dropdown')
  const dropdownButton = document.getElementById('dropdown-button')
  
  if (dropdown && !dropdown.contains(event.target) && !dropdownButton.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const logout = async () => {
  closeDropdown()
  await authStore.logout()
  // Redirect to home page after logout
  window.location.href = '/'
}
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
          <RouterLink to="/about" class="text-gray-600 hover:text-primary">About</RouterLink>
          
          <!-- Show these links only when not authenticated -->
          <template v-if="!isAuthenticated">
            <RouterLink to="/login" class="text-gray-600 hover:text-primary">Login</RouterLink>
            <RouterLink to="/register" class="text-gray-600 hover:text-primary">Register</RouterLink>
          </template>
          
          <!-- Show these links only when authenticated -->
          <template v-else>
            <RouterLink to="/dashboard" class="text-gray-600 hover:text-primary">Dashboard</RouterLink>
            <RouterLink to="/projects" class="text-gray-600 hover:text-primary">Projects</RouterLink>
            <RouterLink to="/tasks" class="text-gray-600 hover:text-primary">Tasks</RouterLink>
            
            <!-- User dropdown -->
            <div class="relative">
              <button 
                id="dropdown-button"
                @click="toggleDropdown"
                class="flex items-center space-x-1 text-gray-600 hover:text-primary focus:outline-none"
              >
                <span>{{ user?.name || 'User' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <div 
                id="user-dropdown"
                v-show="isDropdownOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
              >
                <RouterLink 
                  to="/profile" 
                  @click="closeDropdown"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </RouterLink>
                <RouterLink 
                  to="/settings" 
                  @click="closeDropdown"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </RouterLink>
                <button 
                  @click="logout" 
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </template>
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
