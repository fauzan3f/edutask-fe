<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projectService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const project = ref(null)
const isLoading = ref(true)
const error = ref('')

// Dummy data for now
const dummyProjects = [
  {
    id: 1,
    name: 'EduTask Platform',
    description: 'A collaborative task management platform for educational projects. The platform aims to facilitate collaboration among students and teachers for educational projects, providing tools for task management, progress tracking, and communication.',
    status: 'In Progress',
    deadline: '2025-07-30',
    progress: 65,
    members: [
      { id: 1, name: 'Manager', role: 'Project Manager', avatar: null },
      { id: 2, name: 'John Doe', role: 'Developer', avatar: null },
      { id: 3, name: 'Jane Smith', role: 'Designer', avatar: null },
      { id: 4, name: 'Alex Johnson', role: 'Tester', avatar: null },
      { id: 5, name: 'Sarah Wilson', role: 'Content Writer', avatar: null }
    ],
    tasks: [
      { id: 1, title: 'Design Database Schema', status: 'completed', priority: 'high', assigned_to: 'John Doe' },
      { id: 2, title: 'Implement User Authentication', status: 'in-progress', priority: 'high', assigned_to: 'Jane Smith' },
      { id: 3, title: 'Create Frontend Components', status: 'in-progress', priority: 'medium', assigned_to: 'You' }
    ]
  },
  {
    id: 2,
    name: 'Mobile Learning App',
    description: 'Cross-platform mobile application for e-learning. This app will provide an interactive learning experience for students on mobile devices, with features like video lessons, quizzes, progress tracking, and offline access.',
    status: 'Planning',
    deadline: '2025-08-15',
    progress: 20,
    members: [
      { id: 1, name: 'Manager', role: 'Project Manager', avatar: null },
      { id: 4, name: 'Alex Johnson', role: 'Mobile Developer', avatar: null },
      { id: 5, name: 'Sarah Wilson', role: 'UI/UX Designer', avatar: null }
    ],
    tasks: [
      { id: 4, title: 'Mobile App Wireframes', status: 'todo', priority: 'medium', assigned_to: 'Alex Johnson' }
    ]
  },
  {
    id: 3,
    name: 'Virtual Lab Simulator',
    description: 'Interactive virtual laboratory for science experiments. This simulator will allow students to perform virtual science experiments in a safe environment, with realistic physics simulations and interactive learning materials.',
    status: 'Completed',
    deadline: '2025-06-01',
    progress: 100,
    members: [
      { id: 1, name: 'Manager', role: 'Project Manager', avatar: null },
      { id: 2, name: 'John Doe', role: 'Developer', avatar: null },
      { id: 3, name: 'Jane Smith', role: 'Designer', avatar: null },
      { id: 5, name: 'Sarah Wilson', role: 'Content Writer', avatar: null }
    ],
    tasks: [
      { id: 5, title: 'User Testing Plan', status: 'todo', priority: 'low', assigned_to: 'Sarah Wilson' }
    ]
  }
]

onMounted(async () => {
  try {
    const projectId = parseInt(route.params.id as string)
    
    // In a real app, we would fetch project from the API
    // const response = await projectService.getById(projectId)
    // project.value = response.data
    
    // For now, use dummy data
    setTimeout(() => {
      project.value = dummyProjects.find(p => p.id === projectId) || null
      
      if (!project.value) {
        error.value = 'Project not found'
      }
      
      isLoading.value = false
    }, 500)
  } catch (err: any) {
    error.value = 'Failed to load project details'
    isLoading.value = false
  }
})

const editProject = () => {
  router.push(`/projects/${route.params.id}/edit`)
}

const deleteProject = async () => {
  if (!confirm('Are you sure you want to delete this project?')) {
    return
  }
  
  try {
    // In a real app, we would call the API
    // await projectService.delete(route.params.id)
    
    // Navigate back to projects list
    router.push('/projects')
  } catch (err: any) {
    error.value = 'Failed to delete project'
  }
}

const goToTask = (taskId: number) => {
  router.push(`/tasks/${taskId}`)
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
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center mb-6">
      <button 
        @click="router.push('/projects')" 
        class="mr-2 text-gray-600 hover:text-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-900">Project Details</h1>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md">
      {{ error }}
    </div>
    
    <div v-else-if="!project" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900">Project not found</h3>
      <p class="mt-1 text-gray-500">The requested project does not exist or has been deleted.</p>
      <button 
        @click="router.push('/projects')"
        class="btn btn-primary mt-4"
      >
        Back to Projects
      </button>
    </div>
    
    <div v-else>
      <div class="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div class="p-6">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between">
            <div class="mb-4 md:mb-0">
              <div class="flex items-center mb-2">
                <h2 class="text-xl font-bold text-gray-900 mr-3">{{ project.name }}</h2>
                <span :class="['px-2 py-1 text-xs rounded-full font-medium', getStatusColor(project.status)]">
                  {{ project.status }}
                </span>
              </div>
              <p class="text-gray-600">{{ project.description }}</p>
            </div>
            
            <div class="flex space-x-2">
              <button 
                @click="editProject"
                class="btn btn-outline-primary"
                v-if="authStore.isAdmin || authStore.isProjectManager"
              >
                Edit
              </button>
              <button 
                @click="deleteProject"
                class="btn btn-outline-danger"
                v-if="authStore.isAdmin"
              >
                Delete
              </button>
            </div>
          </div>
          
          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Project Details</h3>
              <div class="space-y-3">
                <div>
                  <div class="text-sm text-gray-500 mb-1">Deadline</div>
                  <div class="font-medium">{{ project.deadline }}</div>
                </div>
                
                <div>
                  <div class="text-sm text-gray-500 mb-1">Progress</div>
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        class="bg-primary h-2 rounded-full" 
                        :style="{ width: `${project.progress}%` }"
                      ></div>
                    </div>
                    <span class="text-sm font-medium">{{ project.progress }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Team Members</h3>
              <div class="space-y-3">
                <div 
                  v-for="member in project.members" 
                  :key="member.id"
                  class="flex items-center"
                >
                  <div class="flex-shrink-0">
                    <div v-if="member.avatar" class="w-8 h-8 rounded-full overflow-hidden">
                      <img :src="member.avatar" alt="Avatar" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-600">{{ member.name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                    <p class="text-xs text-gray-500">{{ member.role }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Tasks</h3>
            <button 
              @click="router.push(`/tasks/create?project=${project.id}`)"
              class="btn btn-primary text-sm"
              v-if="authStore.hasPermission('create task')"
            >
              Add Task
            </button>
          </div>
        </div>
        
        <div v-if="project.tasks.length === 0" class="p-6 text-center">
          <p class="text-gray-500">No tasks have been added to this project yet.</p>
        </div>
        
        <ul v-else class="divide-y divide-gray-200">
          <li 
            v-for="task in project.tasks" 
            :key="task.id" 
            class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            @click="goToTask(task.id)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div :class="['w-2 h-2 mt-1.5 rounded-full mr-2', task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500']"></div>
                <div>
                  <h4 class="text-base font-medium text-gray-900">{{ task.title }}</h4>
                  <div class="flex items-center text-sm text-gray-500 mt-1">
                    <span class="mr-2">Assigned to: {{ task.assigned_to }}</span>
                    <span :class="['px-2 py-0.5 text-xs rounded-full font-medium', getPriorityClass(task.priority)]">
                      {{ task.priority }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template> 