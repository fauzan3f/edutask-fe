<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { projectService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const projects = ref([])
const isLoading = ref(true)
const error = ref('')

// Fallback dummy data jika API gagal
const dummyProjects = [
  {
    id: 1,
    name: 'EduTask Platform',
    description: 'A collaborative task management platform for educational projects',
    status: 'In Progress',
    deadline: '2025-07-30',
    progress: 65,
    members: 5
  },
  {
    id: 2,
    name: 'Mobile Learning App',
    description: 'Cross-platform mobile application for e-learning',
    status: 'Planning',
    deadline: '2025-08-15',
    progress: 20,
    members: 3
  },
  {
    id: 3,
    name: 'Virtual Lab Simulator',
    description: 'Interactive virtual laboratory for science experiments',
    status: 'Completed',
    deadline: '2025-06-01',
    progress: 100,
    members: 4
  }
]

const fetchProjects = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    // Fetch projects from the API
    const response = await projectService.getAll()
    projects.value = response.data.data || response.data
    
    // If no projects returned, check if it's due to empty data or wrong format
    if (!projects.value || projects.value.length === 0) {
      console.log('No projects returned from API, using dummy data')
      projects.value = dummyProjects
    }
  } catch (err: any) {
    console.error('Error fetching projects:', err)
    error.value = 'Failed to load projects. Using sample data instead.'
    // Use dummy data as fallback
    projects.value = dummyProjects
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})

const goToProject = (id: number) => {
  router.push(`/projects/${id}`)
}

const createNewProject = () => {
  router.push('/projects/create')
}

// Function to get status color class
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in progress':
      return 'bg-blue-100 text-blue-800'
    case 'planning':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Format date for better display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  } catch (e) {
    return dateString
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Projects</h1>
      <button 
        @click="createNewProject"
        class="btn btn-primary"
        v-if="authStore.hasPermission('create project')"
      >
        Create New Project
      </button>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md">
      {{ error }}
    </div>
    
    <div v-else-if="projects.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900">No projects found</h3>
      <p class="mt-1 text-gray-500">Get started by creating a new project.</p>
      <button 
        @click="createNewProject"
        class="btn btn-primary mt-4"
        v-if="authStore.hasPermission('create project')"
      >
        Create New Project
      </button>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="project in projects" 
        :key="project.id" 
        class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        @click="goToProject(project.id)"
      >
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900 mb-1">{{ project.name }}</h3>
            <span :class="['px-2 py-1 text-xs rounded-full font-medium', getStatusColor(project.status)]">
              {{ project.status }}
            </span>
          </div>
          
          <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ project.description }}</p>
          
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Deadline</span>
              <span class="font-medium">{{ formatDate(project.deadline) }}</span>
            </div>
            
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-500">Progress</span>
                <span class="font-medium">{{ project.progress || 0 }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-primary h-2 rounded-full" 
                  :style="{ width: `${project.progress || 0}%` }"
                ></div>
              </div>
            </div>
            
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Team</span>
              <span class="font-medium">{{ project.members || 0 }} members</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Refresh button -->
    <div class="mt-6 text-center">
      <button 
        @click="fetchProjects"
        class="btn btn-outline-primary"
      >
        Refresh Projects
      </button>
    </div>
  </div>
</template> 