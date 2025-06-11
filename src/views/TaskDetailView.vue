<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { taskService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import CommentList from '@/components/CommentList.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const task = ref(null)
const isLoading = ref(true)
const error = ref('')

// Dummy data for now
const dummyTasks = [
  {
    id: 1,
    title: 'Design Database Schema',
    description: 'Create the ERD and database schema for the EduTask platform. Include tables for users, projects, tasks, comments, and attachments. Consider relationships and constraints.',
    status: 'completed',
    priority: 'high',
    project: 'EduTask Platform',
    project_id: 1,
    due_date: '2025-06-05',
    assigned_to: 'John Doe',
    assigned_to_id: 2,
    created_by: 'Manager',
    created_at: '2025-05-15',
    updated_at: '2025-05-30',
    comments: [
      {
        id: 1,
        user: 'Manager',
        content: 'Please make sure to include proper indexes for performance optimization.',
        created_at: '2025-05-20'
      },
      {
        id: 2,
        user: 'John Doe',
        content: 'Added indexes for user_id, project_id, and status columns.',
        created_at: '2025-05-25'
      }
    ],
    attachments: [
      {
        id: 1,
        name: 'database_schema_v1.pdf',
        size: '1.2 MB',
        uploaded_by: 'John Doe',
        uploaded_at: '2025-05-25'
      }
    ]
  },
  {
    id: 2,
    title: 'Implement User Authentication',
    description: 'Set up JWT authentication for the API. Implement login, logout, and token refresh functionality. Ensure secure password storage and validation.',
    status: 'in-progress',
    priority: 'high',
    project: 'EduTask Platform',
    project_id: 1,
    due_date: '2025-06-10',
    assigned_to: 'Jane Smith',
    assigned_to_id: 3,
    created_by: 'Manager',
    created_at: '2025-05-20',
    updated_at: '2025-06-01',
    comments: [
      {
        id: 3,
        user: 'Manager',
        content: 'Make sure to implement proper token expiration and refresh mechanism.',
        created_at: '2025-05-22'
      }
    ],
    attachments: []
  },
  {
    id: 3,
    title: 'Create Frontend Components',
    description: 'Develop reusable UI components for the frontend. Include form elements, cards, modals, and navigation components. Follow the design system guidelines.',
    status: 'in-progress',
    priority: 'medium',
    project: 'EduTask Platform',
    project_id: 1,
    due_date: '2025-06-15',
    assigned_to: 'You',
    assigned_to_id: 1,
    created_by: 'Manager',
    created_at: '2025-05-25',
    updated_at: '2025-06-02',
    comments: [],
    attachments: []
  },
  {
    id: 4,
    title: 'Mobile App Wireframes',
    description: 'Create wireframes for the mobile learning application. Include screens for course listing, lesson view, quiz interface, and user profile.',
    status: 'todo',
    priority: 'medium',
    project: 'Mobile Learning App',
    project_id: 2,
    due_date: '2025-06-20',
    assigned_to: 'Alex Johnson',
    assigned_to_id: 4,
    created_by: 'Manager',
    created_at: '2025-05-30',
    updated_at: '2025-05-30',
    comments: [],
    attachments: []
  },
  {
    id: 5,
    title: 'User Testing Plan',
    description: 'Develop a plan for user testing of the virtual lab simulator. Identify target user groups, testing scenarios, and evaluation metrics.',
    status: 'todo',
    priority: 'low',
    project: 'Virtual Lab Simulator',
    project_id: 3,
    due_date: '2025-06-25',
    assigned_to: 'Sarah Wilson',
    assigned_to_id: 5,
    created_by: 'Manager',
    created_at: '2025-06-01',
    updated_at: '2025-06-01',
    comments: [],
    attachments: []
  }
]

onMounted(async () => {
  try {
    const taskId = parseInt(route.params.id as string)
    
    // In a real app, we would fetch task from the API
    // const response = await taskService.getById(taskId)
    // task.value = response.data
    
    // For now, use dummy data
    setTimeout(() => {
      task.value = dummyTasks.find(t => t.id === taskId) || null
      
      if (!task.value) {
        error.value = 'Task not found'
      }
      
      isLoading.value = false
    }, 500)
  } catch (err: any) {
    error.value = 'Failed to load task details'
    isLoading.value = false
  }
})

const editTask = () => {
  router.push(`/tasks/${route.params.id}/edit`)
}

const deleteTask = async () => {
  if (!confirm('Are you sure you want to delete this task?')) {
    return
  }
  
  try {
    // In a real app, we would call the API
    // await taskService.delete(route.params.id)
    
    // Navigate back to tasks list
    router.push('/tasks')
  } catch (err: any) {
    error.value = 'Failed to delete task'
  }
}

const updateStatus = async (newStatus) => {
  try {
    // In a real app, we would call the API
    // await taskService.updateStatus(route.params.id, newStatus)
    
    // Update local state
    if (task.value) {
      task.value.status = newStatus
      task.value.updated_at = new Date().toISOString()
    }
  } catch (err: any) {
    error.value = 'Failed to update task status'
  }
}

const addComment = async (content) => {
  try {
    // In a real app, we would call the API
    // await taskService.addComment(route.params.id, content)
    
    // Update local state
    if (task.value) {
      task.value.comments.push({
        id: Math.floor(Math.random() * 1000),
        user: 'You',
        content,
        created_at: new Date().toISOString()
      })
    }
  } catch (err: any) {
    error.value = 'Failed to add comment'
  }
}

// Function to get priority badge class
const getPriorityClass = (priority: string) => {
  switch (priority.toLowerCase()) {
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
  switch (status.toLowerCase()) {
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

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Handle comment added event
const handleCommentAdded = (comment) => {
  console.log('Comment added:', comment);
  // You can update task here if needed
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center mb-6">
      <button 
        @click="router.push('/tasks')" 
        class="mr-2 text-gray-600 hover:text-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-900">Task Details</h1>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md">
      {{ error }}
    </div>
    
    <div v-else-if="!task" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900">Task not found</h3>
      <p class="mt-1 text-gray-500">The requested task does not exist or has been deleted.</p>
      <button 
        @click="router.push('/tasks')"
        class="btn btn-primary mt-4"
      >
        Back to Tasks
      </button>
    </div>
    
    <div v-else>
      <div class="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div class="p-6">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between">
            <div class="mb-4 md:mb-0">
              <div class="flex items-center mb-2">
                <h2 class="text-xl font-bold text-gray-900 mr-3">{{ task.title }}</h2>
                <span :class="['px-2 py-1 text-xs rounded-full font-medium', getPriorityClass(task.priority)]">
                  {{ task.priority }}
                </span>
              </div>
              <p class="text-gray-600">{{ task.description }}</p>
            </div>
            
            <div class="flex space-x-2">
              <button 
                @click="editTask"
                class="btn btn-outline-primary"
                v-if="authStore.isAdmin || authStore.isProjectManager || (authStore.isTeamMember && task.assigned_to_id === authStore.getUser?.id)"
              >
                Edit
              </button>
              <button 
                @click="deleteTask"
                class="btn btn-outline-danger"
                v-if="authStore.isAdmin || authStore.isProjectManager"
              >
                Delete
              </button>
            </div>
          </div>
          
          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Task Details</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <div class="text-sm text-gray-500">Status</div>
                  <div>
                    <select 
                      v-model="task.status" 
                      @change="updateStatus(task.status)"
                      class="text-sm px-2 py-1 border rounded-md"
                      :class="getStatusClass(task.status)"
                      :disabled="!(authStore.isAdmin || authStore.isProjectManager || (authStore.isTeamMember && task.assigned_to_id === authStore.getUser?.id))"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                
                <div class="flex justify-between">
                  <div class="text-sm text-gray-500">Project</div>
                  <div class="font-medium">
                    <a 
                      :href="`/projects/${task.project_id}`" 
                      class="text-primary hover:underline"
                    >
                      {{ task.project }}
                    </a>
                  </div>
                </div>
                
                <div class="flex justify-between">
                  <div class="text-sm text-gray-500">Due Date</div>
                  <div class="font-medium">{{ task.due_date }}</div>
                </div>
                
                <div class="flex justify-between">
                  <div class="text-sm text-gray-500">Assigned To</div>
                  <div class="font-medium">{{ task.assigned_to }}</div>
                </div>
                
                <div class="flex justify-between">
                  <div class="text-sm text-gray-500">Created By</div>
                  <div class="font-medium">{{ task.created_by }}</div>
                </div>
                
                <div class="flex justify-between">
                  <div class="text-sm text-gray-500">Created</div>
                  <div class="font-medium">{{ formatDate(task.created_at) }}</div>
                </div>
                
                <div class="flex justify-between">
                  <div class="text-sm text-gray-500">Last Updated</div>
                  <div class="font-medium">{{ formatDate(task.updated_at) }}</div>
                </div>
              </div>
            </div>
            
            <div v-if="task.attachments && task.attachments.length > 0">
              <h3 class="text-lg font-medium text-gray-900 mb-3">Attachments</h3>
              <div class="space-y-3">
                <div 
                  v-for="attachment in task.attachments" 
                  :key="attachment.id"
                  class="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                >
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ attachment.name }}</p>
                      <p class="text-xs text-gray-500">{{ attachment.size }} • Uploaded by {{ attachment.uploaded_by }}</p>
                    </div>
                  </div>
                  <button class="text-primary hover:text-primary-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Task Discussions/Comments Section -->
      <div class="bg-white shadow rounded-lg overflow-hidden mt-6">
        <div class="p-6">
          <CommentList :taskId="Number(route.params.id)" @comment-added="handleCommentAdded" />
        </div>
      </div>
    </div>
  </div>
</template> 