<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { taskService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const tasks = ref([])
const isLoading = ref(true)
const error = ref('')
const filterStatus = ref('all')

// Fallback dummy data jika API gagal
const dummyTasks = [
  {
    id: 1,
    title: 'Design Database Schema',
    description: 'Create the ERD and database schema for the EduTask platform',
    status: 'completed',
    priority: 'high',
    project: 'EduTask Platform',
    project_id: 1,
    due_date: '2025-06-05',
    assigned_to: 'John Doe'
  },
  {
    id: 2,
    title: 'Implement User Authentication',
    description: 'Set up JWT authentication for the API',
    status: 'in-progress',
    priority: 'high',
    project: 'EduTask Platform',
    project_id: 1,
    due_date: '2025-06-10',
    assigned_to: 'Jane Smith'
  },
  {
    id: 3,
    title: 'Create Frontend Components',
    description: 'Develop reusable UI components for the frontend',
    status: 'in-progress',
    priority: 'medium',
    project: 'EduTask Platform',
    project_id: 1,
    due_date: '2025-06-15',
    assigned_to: 'You'
  },
  {
    id: 4,
    title: 'Mobile App Wireframes',
    description: 'Create wireframes for the mobile learning application',
    status: 'todo',
    priority: 'medium',
    project: 'Mobile Learning App',
    project_id: 2,
    due_date: '2025-06-20',
    assigned_to: 'Alex Johnson'
  },
  {
    id: 5,
    title: 'User Testing Plan',
    description: 'Develop a plan for user testing of the virtual lab simulator',
    status: 'todo',
    priority: 'low',
    project: 'Virtual Lab Simulator',
    project_id: 3,
    due_date: '2025-06-25',
    assigned_to: 'Sarah Wilson'
  }
]

// Status options
const statusOptions = [
  { value: 'all', label: 'All Tasks' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
]

const fetchTasks = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    // Fetch tasks from the API
    const response = await taskService.getAll()
    tasks.value = response.data.data || response.data
    
    // If no tasks returned, check if it's due to empty data or wrong format
    if (!tasks.value || tasks.value.length === 0) {
      console.log('No tasks returned from API, using dummy data')
      tasks.value = dummyTasks
    }
  } catch (err: any) {
    console.error('Error fetching tasks:', err)
    error.value = 'Failed to load tasks. Using sample data instead.'
    // Use dummy data as fallback
    tasks.value = dummyTasks
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTasks()
})

const filteredTasks = computed(() => {
  if (filterStatus.value === 'all') {
    return tasks.value
  }
  return tasks.value.filter(task => task.status === filterStatus.value)
})

const goToTask = (id: number) => {
  router.push(`/tasks/${id}`)
}

const createNewTask = () => {
  router.push('/tasks/create')
}

// Function to get priority badge class
const getPriorityClass = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Function to get status class
const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'border-green-500 text-green-700'
    case 'in-progress':
      return 'border-blue-500 text-blue-700'
    case 'todo':
      return 'border-gray-500 text-gray-700'
    default:
      return 'border-gray-300 text-gray-700'
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
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
      <h1 class="text-2xl font-bold text-gray-900">Tasks</h1>
      
      <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <div class="relative">
          <select
            v-model="filterStatus"
            class="input pr-10 appearance-none"
          >
            <option 
              v-for="option in statusOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <button 
          @click="createNewTask"
          class="btn btn-primary"
          v-if="authStore.hasPermission('create task')"
        >
          Create New Task
        </button>
      </div>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md">
      {{ error }}
    </div>
    
    <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900">No tasks found</h3>
      <p class="mt-1 text-gray-500">
        {{ filterStatus === 'all' ? 'Get started by creating a new task.' : 'No tasks with the selected status.' }}
      </p>
      <button 
        v-if="filterStatus !== 'all'" 
        @click="filterStatus = 'all'" 
        class="btn btn-outline-primary mt-4 mr-2"
      >
        Show All Tasks
      </button>
      <button 
        @click="createNewTask"
        class="btn btn-primary mt-4"
        v-if="authStore.hasPermission('create task')"
      >
        Create New Task
      </button>
    </div>
    
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <ul class="divide-y divide-gray-200">
        <li 
          v-for="task in filteredTasks" 
          :key="task.id" 
          class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          @click="goToTask(task.id)"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between">
            <div class="mb-2 sm:mb-0">
              <div class="flex items-start">
                <div :class="['w-2 h-2 mt-1.5 rounded-full mr-2', task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500']"></div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ task.title }}</h3>
                  <p class="text-gray-600 text-sm mt-1">{{ task.description }}</p>
                </div>
              </div>
            </div>
            
            <div class="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
              <span :class="['px-2 py-1 text-xs rounded-full font-medium', getPriorityClass(task.priority)]">
                {{ task.priority || 'normal' }}
              </span>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {{ task.project || 'No Project' }}
              </span>
            </div>
          </div>
          
          <div class="mt-3 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-y-1 sm:gap-x-4">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due: {{ formatDate(task.due_date) }}
            </div>
            
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Assigned to: {{ task.assigned_to || 'Unassigned' }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    
    <!-- Refresh button -->
    <div class="mt-6 text-center">
      <button 
        @click="fetchTasks"
        class="btn btn-outline-primary"
      >
        Refresh Tasks
      </button>
    </div>
  </div>
</template> 