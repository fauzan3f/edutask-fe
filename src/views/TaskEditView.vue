<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { taskService, projectService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const isFetching = ref(true)
const error = ref('')
const projects = ref([])
const isLoadingProjects = ref(true)

// Form fields
const id = ref(null)
const title = ref('')
const description = ref('')
const project_id = ref('')
const status = ref('todo')
const priority = ref('medium')
const due_date = ref('')
const assigned_to = ref('')

// Status options
const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
]

// Priority options
const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

// Team members (would be fetched from API in a real app)
const teamMembers = ref([
  { id: 1, name: 'Admin', email: 'admin@example.com' },
  { id: 2, name: 'Manager', email: 'manager@example.com' },
  { id: 3, name: 'John Doe', email: 'john@example.com' },
  { id: 4, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 5, name: 'Alex Johnson', email: 'alex@example.com' }
])

// Dummy tasks data for development
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
    assigned_to: 2,
    created_by: 'Manager'
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
    assigned_to: 3,
    created_by: 'Manager'
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
    assigned_to: 1,
    created_by: 'Manager'
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
    assigned_to: 4,
    created_by: 'Manager'
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
    assigned_to: 5,
    created_by: 'Manager'
  }
]

onMounted(async () => {
  const taskId = parseInt(route.params.id as string)
  
  try {
    // Fetch projects
    try {
      const projectResponse = await projectService.getAll()
      projects.value = projectResponse.data.data || projectResponse.data
    } catch (err) {
      console.error('Error fetching projects:', err)
      // Use dummy data as fallback
      projects.value = [
        { id: 1, name: 'EduTask Platform' },
        { id: 2, name: 'Mobile Learning App' },
        { id: 3, name: 'Virtual Lab Simulator' }
      ]
    } finally {
      isLoadingProjects.value = false
    }
    
    // Fetch task details
    try {
      // In a real app, we would fetch task from the API
      const response = await taskService.get(taskId)
      const taskData = response.data.data || response.data
      
      // If no task returned or error, check dummy data
      if (!taskData) {
        throw new Error('Task not found')
      }
      
      // Check permissions - admin and project manager can always edit
      // Team members can only edit if they are assigned to the task
      const isAdmin = authStore.isAdmin;
      const isProjectManager = authStore.isProjectManager;
      const isAssignedMember = (authStore.isTeamMember && taskData.assigned_to == authStore.getUser?.id);
      
      if (!isAdmin && !isProjectManager && !isAssignedMember) {
        // Redirect to task detail view if not authorized
        router.push(`/tasks/${taskId}`);
        return;
      }
      
      // Populate form fields
      id.value = taskData.id
      title.value = taskData.title
      description.value = taskData.description
      project_id.value = taskData.project_id
      status.value = taskData.status
      priority.value = taskData.priority
      due_date.value = taskData.due_date
      assigned_to.value = taskData.assigned_to
    } catch (err) {
      console.error('Error fetching task, trying dummy data:', err)
      
      // Try to find task in dummy data
      const dummyTask = dummyTasks.find(t => t.id === taskId)
      
      if (dummyTask) {
        // Check permissions - admin and project manager can always edit
        // Team members can only edit if they are assigned to the task
        const isAdmin = authStore.isAdmin;
        const isProjectManager = authStore.isProjectManager;
        const isAssignedMember = (authStore.isTeamMember && dummyTask.assigned_to == authStore.getUser?.id);
        
        if (!isAdmin && !isProjectManager && !isAssignedMember) {
          // Redirect to task detail view if not authorized
          router.push(`/tasks/${taskId}`);
          return;
        }
        
        // Populate form fields from dummy data
        id.value = dummyTask.id
        title.value = dummyTask.title
        description.value = dummyTask.description
        project_id.value = dummyTask.project_id
        status.value = dummyTask.status
        priority.value = dummyTask.priority
        due_date.value = dummyTask.due_date
        assigned_to.value = dummyTask.assigned_to
      } else {
        error.value = 'Task not found'
        setTimeout(() => {
          router.push('/tasks')
        }, 2000)
      }
    }
  } catch (err: any) {
    error.value = 'Failed to load task details'
  } finally {
    isFetching.value = false
  }
})

const updateTask = async () => {
  if (!title.value || !description.value || !project_id.value || !status.value || !priority.value || !due_date.value) {
    error.value = 'Please fill in all required fields'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const taskData = {
      title: title.value,
      description: description.value,
      project_id: project_id.value,
      status: status.value,
      priority: priority.value,
      due_date: due_date.value,
      assigned_to: assigned_to.value || null
    }

    const taskId = parseInt(route.params.id as string)
    const response = await taskService.update(taskId, taskData)
    console.log('Task updated:', response.data)
    
    // Redirect to task details
    router.push(`/tasks/${taskId}`)
  } catch (err: any) {
    console.error('Error updating task:', err)
    if (err.response?.data?.errors) {
      // Format validation errors
      const validationErrors = err.response.data.errors
      const errorMessages = Object.values(validationErrors).flat()
      error.value = errorMessages.join(', ')
    } else if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else {
      error.value = 'Failed to update task. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const cancel = () => {
  router.push(`/tasks/${route.params.id}`)
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center mb-6">
      <button 
        @click="router.push(`/tasks/${route.params.id}`)" 
        class="mr-2 text-gray-600 hover:text-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-900">Edit Task</h1>
    </div>
    
    <div v-if="isFetching" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md mb-6">
      {{ error }}
    </div>
    
    <form v-else @submit.prevent="updateTask" class="bg-white shadow rounded-lg p-6">
      <div class="space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Task Title <span class="text-red-500">*</span></label>
          <input
            id="title"
            v-model="title"
            type="text"
            required
            class="input w-full mt-1"
            placeholder="Enter task title"
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
            placeholder="Enter task description"
          ></textarea>
        </div>
        
        <div>
          <label for="project" class="block text-sm font-medium text-gray-700">Project <span class="text-red-500">*</span></label>
          <div v-if="isLoadingProjects" class="flex items-center mt-1">
            <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
            <span class="text-sm text-gray-500">Loading projects...</span>
          </div>
          <select
            v-else
            id="project"
            v-model="project_id"
            required
            class="input w-full mt-1"
          >
            <option value="" disabled>Select a project</option>
            <option 
              v-for="project in projects" 
              :key="project.id" 
              :value="project.id"
            >
              {{ project.name }}
            </option>
          </select>
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
            <label for="priority" class="block text-sm font-medium text-gray-700">Priority <span class="text-red-500">*</span></label>
            <select
              id="priority"
              v-model="priority"
              required
              class="input w-full mt-1"
            >
              <option 
                v-for="option in priorityOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="due_date" class="block text-sm font-medium text-gray-700">Due Date <span class="text-red-500">*</span></label>
            <input
              id="due_date"
              v-model="due_date"
              type="date"
              required
              class="input w-full mt-1"
            />
          </div>
          
          <div>
            <label for="assigned_to" class="block text-sm font-medium text-gray-700">Assigned To</label>
            <select
              id="assigned_to"
              v-model="assigned_to"
              class="input w-full mt-1"
            >
              <option value="">Unassigned</option>
              <option 
                v-for="member in teamMembers" 
                :key="member.id" 
                :value="member.id"
              >
                {{ member.name }}
              </option>
            </select>
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
            <span v-else>Update Task</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template> 