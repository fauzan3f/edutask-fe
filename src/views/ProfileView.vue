<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isLoading = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')

// Form fields
const name = ref('')
const email = ref('')
const department = ref('')
const position = ref('')
const bio = ref('')

onMounted(() => {
  if (user.value) {
    name.value = user.value.name || ''
    email.value = user.value.email || ''
    department.value = user.value.department || ''
    position.value = user.value.position || ''
    bio.value = user.value.bio || ''
  }
})

const saveProfile = async () => {
  // This is just a placeholder for now
  // In a real application, you would call an API to update the user profile
  isLoading.value = true
  saveSuccess.value = false
  saveError.value = ''
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (error) {
    saveError.value = 'Failed to save profile'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
    
    <div class="bg-white shadow rounded-lg p-6">
      <div v-if="saveSuccess" class="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
        Profile saved successfully!
      </div>
      
      <div v-if="saveError" class="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
        {{ saveError }}
      </div>
      
      <form @submit.prevent="saveProfile" class="space-y-6">
        <!-- Basic Information -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                v-model="name"
                type="text"
                class="input w-full mt-1"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                v-model="email"
                type="email"
                class="input w-full mt-1"
                disabled
              />
              <p class="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>
            
            <div>
              <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
              <input
                id="department"
                v-model="department"
                type="text"
                class="input w-full mt-1"
              />
            </div>
            
            <div>
              <label for="position" class="block text-sm font-medium text-gray-700">Position</label>
              <input
                id="position"
                v-model="position"
                type="text"
                class="input w-full mt-1"
              />
            </div>
          </div>
        </div>
        
        <!-- Bio -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">Bio</h2>
          <textarea
            v-model="bio"
            rows="4"
            class="input w-full"
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>
        
        <!-- Roles and Permissions (Read-only) -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">Roles & Permissions</h2>
          
          <div class="bg-gray-50 p-4 rounded-md">
            <div class="mb-4">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Your Roles:</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="role in user?.roles" 
                  :key="role" 
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary"
                >
                  {{ role }}
                </span>
                <span v-if="!user?.roles?.length" class="text-sm text-gray-500">No roles assigned</span>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">Your Permissions:</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="permission in user?.permissions" 
                  :key="permission" 
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ permission }}
                </span>
                <span v-if="!user?.permissions?.length" class="text-sm text-gray-500">No specific permissions</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isLoading"
            class="btn btn-primary"
          >
            <span v-if="isLoading">Saving...</span>
            <span v-else>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template> 