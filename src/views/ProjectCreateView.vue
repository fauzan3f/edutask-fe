<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { projectService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const error = ref('')

// Form fields
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

const createProject = async () => {
  if (!name.value || !description.value || !status.value || !deadline.value) {
    error.value = 'Please fill in all required fields'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const projectData = {
      name: name.value,
      description: description.value,
      status: status.value,
      deadline: deadline.value,
      progress: progress.value
    }

    const response = await projectService.create(projectData)
    console.log('Project created:', response.data)
    
    // Redirect to projects list
    router.push('/projects')
  } catch (err: any) {
    console.error('Error creating project:', err)
    if (err.response?.data?.errors) {
      // Format validation errors
      const validationErrors = err.response.data.errors
      const errorMessages = Object.values(validationErrors).flat()
      error.value = errorMessages.join(', ')
    } else if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else {
      error.value = 'Failed to create project. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const cancel = () => {
  router.push('/projects')
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Create New Project</h1>
    </div>
    
    <div v-if="error" class="bg-red-50 text-red-700 p-4 rounded-md mb-6">
      {{ error }}
    </div>
    
    <form @submit.prevent="createProject" class="bg-white shadow rounded-lg p-6">
      <div class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Project Name <span class="text-red-500">*</span></label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            class="input w-full mt-1"
            placeholder="Enter project name"
          />
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description <span class="text-red-500">*</span></label>
          <textarea
            id="description"
            v-model="description"
            rows="4"
            required
            class="input w-full mt-1"
            placeholder="Enter project description"
          ></textarea>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status <span class="text-red-500">*</span></label>
            <select
              id="status"
              v-model="status"
              required
              class="input w-full mt-1"
            >
              <option 
                v-for="option in statusOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="deadline" class="block text-sm font-medium text-gray-700">Deadline <span class="text-red-500">*</span></label>
            <input
              id="deadline"
              v-model="deadline"
              type="date"
              required
              class="input w-full mt-1"
            />
          </div>
        </div>
        
        <div>
          <label for="progress" class="block text-sm font-medium text-gray-700">Progress ({{ progress }}%)</label>
          <input
            id="progress"
            v-model="progress"
            type="range"
            min="0"
            max="100"
            step="5"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
          />
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
            <span v-if="isLoading">Creating...</span>
            <span v-else>Create Project</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template> 