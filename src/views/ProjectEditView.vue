<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projectService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const isFetching = ref(true)
const error = ref('')
const validationErrors = ref({})

// Form fields
const id = ref(null)
const name = ref('')
const description = ref('')
const status = ref('Planning')
const deadline = ref('')
const progress = ref(0)

// Status options
const statusOptions = [
  { value: 'Planning', label: 'Planning' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' }
]

// Dummy projects data for development
const dummyProjects = [
  {
    id: 1,
    name: 'EduTask Platform',
    description: 'A collaborative task management platform for educational projects',
    status: 'In Progress',
    deadline: '2025-07-30',
    progress: 65
  },
  {
    id: 2,
    name: 'Mobile Learning App',
    description: 'Cross-platform mobile application for e-learning',
    status: 'Planning',
    deadline: '2025-08-15',
    progress: 20
  },
  {
    id: 3,
    name: 'Virtual Lab Simulator',
    description: 'Interactive virtual laboratory for science experiments',
    status: 'Completed',
    deadline: '2025-06-01',
    progress: 100
  }
]

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format date for input field (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ''; // Return empty if invalid
  return date.toISOString().split('T')[0];
}

onMounted(async () => {
  const projectId = parseInt(route.params.id as string)
  
  // Reset state
  error.value = ''
  validationErrors.value = {}
  
  try {
    // Check if user has permission to edit projects
    if (!authStore.isAdmin && !authStore.isProjectManager) {
      router.push(`/projects/${projectId}`)
      return
    }
    
    // Fetch project details
    try {
      // In a real app, we would fetch project from the API
      const response = await projectService.get(projectId)
      const projectData = response.data.data || response.data
      
      // If no project returned or error, check dummy data
      if (!projectData) {
        throw new Error('Project not found')
      }
      
      // Populate form fields
      id.value = projectData.id
      name.value = projectData.name
      description.value = projectData.description
      status.value = projectData.status
      if (projectData && projectData.deadline) {
        deadline.value = formatDateForInput(projectData.deadline);
      }
      progress.value = projectData.progress || 0
    } catch (err) {
      console.error('Error fetching project, trying dummy data:', err)
      
      // Try to find project in dummy data
      const dummyProject = dummyProjects.find(p => p.id === projectId)
      
      if (dummyProject) {
        // Populate form fields from dummy data
        id.value = dummyProject.id
        name.value = dummyProject.name
        description.value = dummyProject.description
        status.value = dummyProject.status
        if (dummyProject && dummyProject.deadline) {
          deadline.value = formatDateForInput(dummyProject.deadline);
        }
        progress.value = dummyProject.progress
      } else {
        error.value = 'Project not found'
        setTimeout(() => {
          router.push('/projects')
        }, 2000)
      }
    }
  } catch (err: any) {
    error.value = 'Failed to load project details'
  } finally {
    isFetching.value = false
  }
})

const updateProject = async () => {
  if (!name.value || !description.value || !status.value || !deadline.value) {
    error.value = 'Please fill in all required fields'
    return
  }

  isLoading.value = true
  error.value = ''
  validationErrors.value = {}
  
  try {
    // Ensure progress is an integer
    const progressValue = parseInt(progress.value)
    
    const projectData = {
      name: name.value,
      description: description.value,
      status: status.value,
      deadline: deadline.value,
      progress: progressValue
    }

    console.log('Sending project data:', projectData)
    console.log('Progress type:', typeof projectData.progress)
    
    const projectId = parseInt(route.params.id as string)
    const response = await projectService.update(projectId, projectData)
    console.log('Project updated:', response.data)
    
    // Redirect to project details
    router.push(`/projects/${projectId}`)
  } catch (err: any) {
    console.error('Error updating project:', err)
    isLoading.value = false
    
    if (err.response?.data?.errors) {
      // Format validation errors
      validationErrors.value = err.response.data.errors
      const errorMessages = Object.values(validationErrors.value).flat()
      error.value = errorMessages.join(', ')
    } else if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else {
      error.value = 'Failed to update project. Please try again.'
    }
  }
}

const cancel = () => {
  router.push(`/projects/${route.params.id}`)
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center mb-6">
      <button 
        @click="router.push(`/projects/${route.params.id}`)" 
        class="mr-2 text-gray-600 hover:text-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-900">Edit Project</h1>
    </div>
    
    <div v-if="isFetching" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md mb-6">
      {{ error }}
    </div>
    
    <form v-else @submit.prevent="updateProject" class="bg-white shadow rounded-lg p-6">
      <div class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Project Name <span class="text-red-500">*</span></label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            class="input w-full mt-1"
            :class="{ 'border-red-500': validationErrors.value?.name }"
            placeholder="Enter project name"
          />
          <div v-if="validationErrors.value?.name" class="text-red-500 text-sm mt-1">
            {{ validationErrors.value.name[0] }}
          </div>
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description <span class="text-red-500">*</span></label>
          <textarea
            id="description"
            v-model="description"
            rows="4"
            required
            class="input w-full mt-1"
            :class="{ 'border-red-500': validationErrors.value?.description }"
            placeholder="Enter project description"
          ></textarea>
          <div v-if="validationErrors.value?.description" class="text-red-500 text-sm mt-1">
            {{ validationErrors.value.description[0] }}
          </div>
        </div>
        
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Status <span class="text-red-500">*</span></label>
          <select
            id="status"
            v-model="status"
            required
            class="input w-full mt-1"
            :class="{ 'border-red-500': validationErrors.value?.status }"
          >
            <option value="" disabled>Select status</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <div v-if="validationErrors.value?.status" class="text-red-500 text-sm mt-1">
            {{ validationErrors.value.status[0] }}
          </div>
        </div>
        
        <div class="mb-4">
          <label for="deadline" class="block text-sm font-medium text-gray-700">Deadline <span class="text-red-500">*</span></label>
          <input
            id="deadline"
            v-model="deadline"
            type="date"
            class="input w-full mt-1"
            :class="{ 'border-red-500': validationErrors.value?.deadline }"
            required
          />
          <div class="text-sm text-gray-500 mt-1" v-if="deadline">
            Selected date: {{ formatDate(deadline) }}
          </div>
          <div v-if="validationErrors.value?.deadline" class="text-red-500 text-sm mt-1">
            {{ validationErrors.value.deadline[0] }}
          </div>
        </div>
        
        <div>
          <label for="progress" class="block text-sm font-medium text-gray-700">Progress</label>
          <input
            id="progress"
            v-model="progress"
            type="number"
            min="0"
            max="100"
            class="input w-full mt-1"
            :class="{ 'border-red-500': validationErrors.value?.progress }"
          />
          <div v-if="validationErrors.value?.progress" class="text-red-500 text-sm mt-1">
            {{ validationErrors.value.progress[0] }}
          </div>
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
            :disabled="isLoading"
          >
            <span v-if="isLoading">Updating...</span>
            <span v-else>Update Project</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template> 