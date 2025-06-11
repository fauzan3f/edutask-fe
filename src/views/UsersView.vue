<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const users = ref([])
const isLoading = ref(true)
const error = ref('')

// Check if user has permission to manage users
const canManageUsers = computed(() => authStore.hasPermission('manage users'))

// Redirect if user doesn't have permission
if (!canManageUsers.value) {
  router.push('/dashboard')
}

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    users.value = response.data.data
  } catch (err) {
    console.error('Error fetching users:', err)
    error.value = 'Failed to load users. Please try again.'
    
    // Fallback data for development
    users.value = [
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
      },
      {
        id: 4,
        name: 'Fauzan Fathurrahman',
        email: 'fauzan@edutask.com',
        department: 'Development',
        position: 'Frontend Developer',
        roles: ['team_member']
      },
      {
        id: 5,
        name: 'Ahmad Rizki',
        email: 'rizki@edutask.com',
        department: 'Development',
        position: 'Backend Developer',
        roles: ['team_member']
      }
    ]
  } finally {
    isLoading.value = false
  }
})

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800'
    case 'project_manager':
      return 'bg-blue-100 text-blue-800'
    case 'team_member':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const editUser = (id) => {
  router.push(`/users/${id}/edit`)
}

const deleteUser = async (id) => {
  if (!confirm('Are you sure you want to delete this user?')) {
    return
  }
  
  try {
    await axios.delete(`http://127.0.0.1:8000/api/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    // Remove user from list
    users.value = users.value.filter(user => user.id !== id)
  } catch (err) {
    console.error('Error deleting user:', err)
    alert('Failed to delete user. Please try again.')
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
    </div>
    
    <div v-if="!canManageUsers" class="bg-yellow-50 text-yellow-700 p-4 rounded-md mb-6">
      You don't have permission to manage users.
    </div>
    
    <div v-else-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md mb-6">
      {{ error }}
    </div>
    
    <div v-else>
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ user.department || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ user.position || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  v-for="role in user.roles" 
                  :key="role"
                  :class="['px-2 py-1 text-xs rounded-full font-medium mr-1', getRoleBadgeClass(role)]"
                >
                  {{ role.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="editUser(user.id)" 
                  class="text-primary hover:text-primary-dark mr-3"
                >
                  Edit
                </button>
                <button 
                  @click="deleteUser(user.id)" 
                  class="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template> 