<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { taskService, projectService, userService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const error = ref('')
const projects = ref([])
const isLoadingProjects = ref(true)
const isLoadingUsers = ref(true)

// Form fields
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

// Team members from database
const teamMembers = ref([])

// Fallback dummy users if API fails
const dummyUsers = [
  { id: 1, name: 'Admin', email: 'admin@example.com' },
  { id: 2, name: 'Manager', email: 'manager@example.com' },
  { id: 3, name: 'John Doe', email: 'john@example.com' },
  { id: 4, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 5, name: 'Alex Johnson', email: 'alex@example.com' }
]

// Computed properties for organizing users by role
const adminUsers = computed(() => {
  return teamMembers.value.filter(user => user.role === 'admin');
});

const managerUsers = computed(() => {
  return teamMembers.value.filter(user => user.role === 'project_manager');
});

const teamMemberUsers = computed(() => {
  return teamMembers.value.filter(user => user.role === 'team_member');
});

const otherUsers = computed(() => {
  return teamMembers.value.filter(user => 
    !['admin', 'project_manager', 'team_member'].includes(user.role)
  );
});

onMounted(async () => {
  try {
    // Fetch projects from the API
    const response = await projectService.getAll()
    projects.value = response.data.data || response.data
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

  try {
    // Fetch users from the API using the task-assignees endpoint
    const usersResponse = await userService.getTaskAssignees()
    teamMembers.value = usersResponse.data.data || usersResponse.data
    
    if (!teamMembers.value || !Array.isArray(teamMembers.value) || teamMembers.value.length === 0) {
      console.log('No users returned from API or invalid format, using dummy data')
      teamMembers.value = dummyUsers
    } else {
      console.log('Loaded', teamMembers.value.length, 'users for assignment')
    }
  } catch (err) {
    console.error('Error fetching users:', err)
    // Use dummy data as fallback
    teamMembers.value = dummyUsers
  } finally {
    isLoadingUsers.value = false
  }
})

const createTask = async () => {
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

    const response = await taskService.create(taskData)
    console.log('Task created:', response.data)
    
    // Redirect to tasks list
    router.push('/tasks')
  } catch (err: any) {
    console.error('Error creating task:', err)
    if (err.response?.data?.errors) {
      // Format validation errors
      const validationErrors = err.response.data.errors
      const errorMessages = Object.values(validationErrors).flat()
      error.value = errorMessages.join(', ')
    } else if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else {
      error.value = 'Failed to create task. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const cancel = () => {
  router.push('/tasks')
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Create New Task</h1>
    </div>
    
    <div v-if="error" class="bg-red-50 text-red-700 p-4 rounded-md mb-6">
      {{ error }}
    </div>
    
    <form @submit.prevent="createTask" class="bg-white shadow rounded-lg p-6">
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
            <div v-if="isLoadingUsers" class="flex items-center mt-1">
              <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
              <span class="text-sm text-gray-500">Loading users...</span>
            </div>
            <select
              v-else
              id="assigned_to"
              v-model="assigned_to"
              class="input w-full mt-1"
            >
              <option value="">Unassigned</option>
              
              <!-- Team Members -->
              <optgroup label="Team Members">
                <option 
                  v-for="user in teamMemberUsers" 
                  :key="user.id" 
                  :value="user.id"
                >
                  {{ user.name }} - {{ user.position || 'Team Member' }}
                </option>
              </optgroup>
              
              <!-- Project Managers -->
              <optgroup label="Project Managers" v-if="managerUsers.length > 0">
                <option 
                  v-for="user in managerUsers" 
                  :key="user.id" 
                  :value="user.id"
                >
                  {{ user.name }} - {{ user.position || 'Project Manager' }}
                </option>
              </optgroup>
              
              <!-- Admins -->
              <optgroup label="Administrators" v-if="adminUsers.length > 0">
                <option 
                  v-for="user in adminUsers" 
                  :key="user.id" 
                  :value="user.id"
                >
                  {{ user.name }} - {{ user.position || 'Administrator' }}
                </option>
              </optgroup>
              
              <!-- Other Users -->
              <optgroup label="Other Users" v-if="otherUsers.length > 0">
                <option 
                  v-for="user in otherUsers" 
                  :key="user.id" 
                  :value="user.id"
                >
                  {{ user.name }} - {{ user.position || 'User' }}
                </option>
              </optgroup>
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
            <span v-if="isLoading">Creating...</span>
            <span v-else>Create Task</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template> 