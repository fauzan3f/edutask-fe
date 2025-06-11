<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const userId = route.params.id

const user = ref({
  id: null,
  name: '',
  email: '',
  department: '',
  position: '',
  role: ''
})

const roles = ref([
  { id: 'admin', name: 'Admin' },
  { id: 'project_manager', name: 'Project Manager' },
  { id: 'team_member', name: 'Team Member' }
])

const isLoading = ref(true)
const isSaving = ref(false)
const error = ref('')
const successMessage = ref('')

// Check if user has permission to manage users
const canManageUsers = computed(() => authStore.hasPermission('manage users'))

// Redirect if user doesn't have permission
if (!canManageUsers.value) {
  router.push('/dashboard')
}

onMounted(async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    const userData = response.data.data
    user.value = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      department: userData.department || '',
      position: userData.position || '',
      role: userData.roles && userData.roles.length > 0 ? userData.roles[0] : ''
    }
  } catch (err) {
    console.error('Error fetching user:', err)
    error.value = 'Failed to load user data. Please try again.'
    
    // Fallback data for development
    const dummyUsers = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@edutask.com',
        department: 'IT',
        position: 'System Administrator',
        roles: ['admin']
      },
      {
        id: 2,
        name: 'Project Manager',
        email: 'manager@edutask.com',
        department: 'Project Management',
        position: 'Project Manager',
        roles: ['project_manager']
      },
      {
        id: 3,
        name: 'Team Member',
        email: 'member@edutask.com',
        department: 'Development',
        position: 'Developer',
        roles: ['team_member']
      }
    ]
    
    const dummyUser = dummyUsers.find(u => u.id === parseInt(userId as string))
    if (dummyUser) {
      user.value = {
        id: dummyUser.id,
        name: dummyUser.name,
        email: dummyUser.email,
        department: dummyUser.department || '',
        position: dummyUser.position || '',
        role: dummyUser.roles && dummyUser.roles.length > 0 ? dummyUser.roles[0] : ''
      }
    }
  } finally {
    isLoading.value = false
  }
})

const saveUser = async () => {
  isSaving.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    const userData = {
      name: user.value.name,
      email: user.value.email,
      department: user.value.department,
      position: user.value.position,
      role: user.value.role
    }
    
    await axios.put(`http://127.0.0.1:8000/api/users/${userId}`, userData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    successMessage.value = 'User updated successfully'
    
    // Redirect back to users list after a short delay
    setTimeout(() => {
      router.push('/users')
    }, 1500)
  } catch (err) {
    console.error('Error updating user:', err)
    error.value = 'Failed to update user. Please try again.'
  } finally {
    isSaving.value = false
  }
}

const cancel = () => {
  router.push('/users')
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center mb-6">
      <button 
        @click="router.push('/users')" 
        class="mr-2 text-gray-600 hover:text-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-900">Edit User</h1>
    </div>
    
    <div v-if="!canManageUsers" class="bg-yellow-50 text-yellow-700 p-4 rounded-md mb-6">
      You don't have permission to manage users.
    </div>
    
    <div v-else-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else>
      <div v-if="error" class="bg-red-50 text-red-700 p-4 rounded-md mb-6">
        {{ error }}
      </div>
      
      <div v-if="successMessage" class="bg-green-50 text-green-700 p-4 rounded-md mb-6">
        {{ successMessage }}
      </div>
      
      <form @submit.prevent="saveUser" class="bg-white shadow rounded-lg p-6">
        <div class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              v-model="user.name"
              type="text"
              required
              class="input w-full mt-1"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="user.email"
              type="email"
              required
              class="input w-full mt-1"
            />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
              <input
                id="department"
                v-model="user.department"
                type="text"
                class="input w-full mt-1"
              />
            </div>
            
            <div>
              <label for="position" class="block text-sm font-medium text-gray-700">Position</label>
              <input
                id="position"
                v-model="user.position"
                type="text"
                class="input w-full mt-1"
              />
            </div>
          </div>
          
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              v-model="user.role"
              required
              class="input w-full mt-1"
            >
              <option value="" disabled>Select a role</option>
              <option 
                v-for="role in roles" 
                :key="role.id" 
                :value="role.id"
              >
                {{ role.name }}
              </option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              @click="cancel" 
              class="btn btn-outline-primary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="isSaving"
            >
              <span v-if="isSaving">Saving...</span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template> 