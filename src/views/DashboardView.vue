<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(true)
const error = ref('')

// Dashboard data
const stats = ref({
  totalProjects: 0,
  activeProjects: 0,
  completedProjects: 0,
  totalTasks: 0,
  pendingTasks: 0,
  completedTasks: 0,
  totalUsers: 0,
  teamMembers: 0,
  projectManagers: 0
})

// Recent projects
const recentProjects = ref([
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
])

// Recent tasks
const recentTasks = ref([
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
  }
])

// Recent team activity
const recentActivity = ref([
  {
    id: 1,
    user: 'Admin',
    action: 'created a new project',
    target: 'EduTask Platform',
    time: '2 hours ago'
  },
  {
    id: 2,
    user: 'Manager',
    action: 'assigned a task to',
    target: 'Jane Smith',
    time: '3 hours ago'
  },
  {
    id: 3,
    user: 'Team Member',
    action: 'completed a task',
    target: 'Design Database Schema',
    time: '5 hours ago'
  },
  {
    id: 4,
    user: 'Jane Smith',
    action: 'commented on',
    target: 'Implement User Authentication',
    time: '1 day ago'
  },
  {
    id: 5,
    user: 'Manager',
    action: 'updated the status of',
    target: 'Mobile Learning App',
    time: '2 days ago'
  }
])

// Team members
const teamMembers = ref([
  {
    id: 1,
    name: 'Admin',
    email: 'admin@example.com',
    role: 'admin',
    avatar: null
  },
  {
    id: 2,
    name: 'Manager',
    email: 'manager@example.com',
    role: 'project_manager',
    avatar: null
  },
  {
    id: 3,
    name: 'Team Member',
    email: 'member@example.com',
    role: 'team_member',
    avatar: null
  },
  {
    id: 4,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'team_member',
    avatar: null
  },
  {
    id: 5,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'team_member',
    avatar: null
  }
])

// Computed properties
const user = computed(() => authStore.user)
const isAdmin = computed(() => authStore.isAdmin)
const isProjectManager = computed(() => authStore.isProjectManager)
const isTeamMember = computed(() => authStore.isTeamMember)

onMounted(async () => {
  try {
    // In a real app, we would fetch data from the API
    // For now, use dummy data
    setTimeout(() => {
      // Set dummy stats based on user role
      if (isAdmin.value) {
        stats.value = {
          totalProjects: 12,
          activeProjects: 8,
          completedProjects: 4,
          totalTasks: 87,
          pendingTasks: 32,
          completedTasks: 55,
          totalUsers: 24,
          teamMembers: 20,
          projectManagers: 4
        }
      } else if (isProjectManager.value) {
        stats.value = {
          totalProjects: 5,
          activeProjects: 3,
          completedProjects: 2,
          totalTasks: 45,
          pendingTasks: 18,
          completedTasks: 27,
          totalUsers: 12,
          teamMembers: 10,
          projectManagers: 2
        }
      } else {
        stats.value = {
          totalProjects: 3,
          activeProjects: 2,
          completedProjects: 1,
          totalTasks: 15,
          pendingTasks: 7,
          completedTasks: 8,
          totalUsers: 0,
          teamMembers: 0,
          projectManagers: 0
        }
      }
      
      isLoading.value = false
    }, 800)
    
  } catch (err: any) {
    error.value = 'Failed to load dashboard data'
    isLoading.value = false
  }
})

const goToProjects = () => {
  router.push('/projects')
}

const goToTasks = () => {
  router.push('/tasks')
}

const goToUsers = () => {
  router.push('/users')
}

const goToProject = (id: number) => {
  router.push(`/projects/${id}`)
}

const goToTask = (id: number) => {
  router.push(`/tasks/${id}`)
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

// Function to get role badge class
const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800'
    case 'project_manager':
      return 'bg-blue-100 text-blue-800'
    case 'team_member':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Welcome, {{ user?.name || 'User' }}!</h1>
      <p class="mt-1 text-gray-500">
        <template v-if="isAdmin">
          Here's an overview of all projects and team activities.
        </template>
        <template v-else-if="isProjectManager">
          Here's an overview of your managed projects and team activities.
        </template>
        <template v-else>
          Here's an overview of your tasks and projects.
        </template>
      </p>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md">
      {{ error }}
    </div>
    
    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Projects Stats -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium text-gray-900">Projects</h2>
            <button 
              @click="goToProjects"
              class="text-primary hover:text-primary-dark text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          <div class="flex justify-between items-center">
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900">{{ stats.totalProjects }}</div>
              <div class="text-sm text-gray-500">Total</div>
            </div>
            
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">{{ stats.activeProjects }}</div>
              <div class="text-sm text-gray-500">Active</div>
            </div>
            
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">{{ stats.completedProjects }}</div>
              <div class="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>
        
        <!-- Tasks Stats -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium text-gray-900">Tasks</h2>
            <button 
              @click="goToTasks"
              class="text-primary hover:text-primary-dark text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          <div class="flex justify-between items-center">
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900">{{ stats.totalTasks }}</div>
              <div class="text-sm text-gray-500">Total</div>
            </div>
            
            <div class="text-center">
              <div class="text-3xl font-bold text-yellow-600">{{ stats.pendingTasks }}</div>
              <div class="text-sm text-gray-500">Pending</div>
            </div>
            
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">{{ stats.completedTasks }}</div>
              <div class="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>
        
        <!-- Team Stats - Only for Admin and Project Manager -->
        <div v-if="isAdmin || isProjectManager" class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium text-gray-900">Team</h2>
            <button 
              v-if="isAdmin"
              @click="goToUsers"
              class="text-primary hover:text-primary-dark text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          <div class="flex justify-between items-center">
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900">{{ stats.totalUsers }}</div>
              <div class="text-sm text-gray-500">Total</div>
            </div>
            
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">{{ stats.projectManagers }}</div>
              <div class="text-sm text-gray-500">Managers</div>
            </div>
            
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">{{ stats.teamMembers }}</div>
              <div class="text-sm text-gray-500">Members</div>
            </div>
          </div>
        </div>
        
        <!-- Personal Stats - Only for Team Members -->
        <div v-if="isTeamMember && !isProjectManager && !isAdmin" class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium text-gray-900">My Progress</h2>
          </div>
          
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-500">Tasks Completed</span>
                <span class="font-medium">{{ stats.completedTasks }} / {{ stats.totalTasks }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-primary h-2 rounded-full" 
                  :style="{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }"
                ></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-500">Projects Involved</span>
                <span class="font-medium">{{ stats.totalProjects }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Projects -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Recent Projects</h2>
              <button 
                @click="goToProjects"
                class="text-primary hover:text-primary-dark text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          
          <div class="divide-y divide-gray-200">
            <div 
              v-for="project in recentProjects.slice(0, 3)" 
              :key="project.id"
              @click="goToProject(project.id)"
              class="p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-base font-medium text-gray-900">{{ project.name }}</h3>
                  <p class="text-sm text-gray-500 mt-1 line-clamp-1">{{ project.description }}</p>
                </div>
                <span :class="['px-2 py-1 text-xs rounded-full font-medium', getStatusColor(project.status)]">
                  {{ project.status }}
                </span>
              </div>
              
              <div class="mt-2">
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{{ project.progress }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    class="bg-primary h-1.5 rounded-full" 
                    :style="{ width: `${project.progress}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recent Tasks -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Recent Tasks</h2>
              <button 
                @click="goToTasks"
                class="text-primary hover:text-primary-dark text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          
          <div class="divide-y divide-gray-200">
            <div 
              v-for="task in recentTasks" 
              :key="task.id"
              @click="goToTask(task.id)"
              class="p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div class="flex justify-between items-start">
                <div class="flex items-start">
                  <div :class="['w-2 h-2 mt-1.5 rounded-full mr-2', task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500']"></div>
                  <div>
                    <h3 class="text-base font-medium text-gray-900">{{ task.title }}</h3>
                    <p class="text-xs text-gray-500 mt-1">{{ task.project }}</p>
                  </div>
                </div>
                <span :class="['px-2 py-1 text-xs rounded-full font-medium', getPriorityClass(task.priority)]">
                  {{ task.priority }}
                </span>
              </div>
              
              <div class="mt-2 flex justify-between text-xs text-gray-500">
                <span>Due: {{ task.due_date }}</span>
                <span>Assigned to: {{ task.assigned_to }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Team Activity - Only for Admin and Project Manager -->
      <div v-if="isAdmin || isProjectManager" class="mt-6">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Recent Team Activity</h2>
          </div>
          
          <div class="divide-y divide-gray-200">
            <div 
              v-for="activity in recentActivity" 
              :key="activity.id"
              class="p-4"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-600">{{ activity.user.charAt(0) }}</span>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-900">
                    <span class="font-medium">{{ activity.user }}</span> {{ activity.action }} 
                    <span class="font-medium">{{ activity.target }}</span>
                  </p>
                  <p class="text-xs text-gray-500">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Team Members - Only for Admin -->
      <div v-if="isAdmin" class="mt-6">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Team Members</h2>
              <button 
                @click="goToUsers"
                class="text-primary hover:text-primary-dark text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          
          <div class="divide-y divide-gray-200">
            <div 
              v-for="member in teamMembers.slice(0, 5)" 
              :key="member.id"
              class="p-4 flex items-center justify-between"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div v-if="member.avatar" class="w-10 h-10 rounded-full overflow-hidden">
                    <img :src="member.avatar" alt="Avatar" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-600">{{ member.name.charAt(0) }}</span>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                  <p class="text-xs text-gray-500">{{ member.email }}</p>
                </div>
              </div>
              <span :class="['px-2 py-1 text-xs rounded-full font-medium', getRoleBadgeClass(member.role)]">
                {{ member.role.replace('_', ' ') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 