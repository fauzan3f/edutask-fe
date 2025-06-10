<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const user = ref(null)
const projects = ref([])
const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    // Get user from localStorage
    const userString = localStorage.getItem('user')
    if (userString) {
      user.value = JSON.parse(userString)
    }

    // Get token from localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Get projects
    const response = await axios.get('http://127.0.0.1:8000/api/projects', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    projects.value = response.data.data
  } catch (err: any) {
    if (err.response && err.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    } else if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Failed to load projects. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<template>
  <div>
    <div class="bg-white shadow">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div class="flex items-center space-x-4">
          <span v-if="user" class="text-gray-600">Welcome, {{ user.name }}</span>
          <button @click="logout" class="btn btn-primary">Logout</button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-500 p-4 rounded-md my-4">
        {{ error }}
      </div>

      <div v-else>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">My Projects</h2>
          <button class="btn btn-primary">New Project</button>
        </div>

        <div v-if="projects.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
          <p class="text-gray-500">You don't have any projects yet.</p>
          <button class="btn btn-primary mt-4">Create your first project</button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="project in projects"
            :key="project.id"
            class="card hover:shadow-lg transition-shadow"
          >
            <h3 class="text-lg font-semibold text-gray-800">{{ project.name }}</h3>
            <p class="text-gray-600 mt-2">{{ project.description }}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-sm text-gray-500">
                {{ new Date(project.created_at).toLocaleDateString() }}
              </span>
              <button class="btn btn-primary text-sm">View Project</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 