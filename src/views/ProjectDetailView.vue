<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projectService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import ProjectProgressChart from '@/components/ProjectProgressChart.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const project = ref(null)
const isLoading = ref(true)
const error = ref('')
const loadingMessage = ref('Loading project details...')

// State for adding new team member
const showAddMemberForm = ref(false)
const newMember = reactive({
  user_id: '',
  role: 'member'
})
const availableRoles = ['manager', 'member', 'viewer']
const addMemberError = ref('')
const addingMember = ref(false)

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

const loadProject = async () => {
  loadingMessage.value = 'Loading project details...'
  isLoading.value = true
  error.value = ''
  
  try {
    const projectId = Number(route.params.id);
    console.log(`Attempting to fetch project ID: ${projectId}`);
    
    if (isNaN(projectId)) {
      error.value = 'Invalid project ID';
      isLoading.value = false;
      return;
    }

    // Fetch project from API
    loadingMessage.value = 'Fetching project data from server...'
    const response = await projectService.get(projectId);
    console.log('API response:', response);
    
    // Check all possible response formats
    if (response && response.data) {
      // Backend might return either response.data directly or nested in response.data.data
      if (response.data.data) {
        // Format: { data: { data: {...} } }
        project.value = response.data.data;
        console.log('Project loaded from API (data.data format):', project.value);
      } else {
        // Format: { data: {...} }
        project.value = response.data;
        console.log('Project loaded from API (data format):', project.value);
      }
      
      // Ensure project has required properties
      if (project.value) {
        // Ensure tasks property exists
        if (!project.value.tasks) {
          console.log('Adding empty tasks array to project');
          project.value.tasks = [];
        }
        
        // Ensure members property exists
        if (!project.value.members) {
          console.log('Adding empty members array to project');
          project.value.members = [];
          
          // Try to fetch members from the API if available
          try {
            loadingMessage.value = 'Fetching team members...';
            const projectId = Number(route.params.id);
            const membersResponse = await projectService.getMembers(projectId);
            console.log('Members API response:', membersResponse);
            
            if (membersResponse && membersResponse.data) {
              const membersData = membersResponse.data.data || membersResponse.data;
              if (Array.isArray(membersData)) {
                project.value.members = membersData;
                console.log('Team members loaded from API:', project.value.members);
              }
            }
          } catch (membersError) {
            console.error('Error fetching team members:', membersError);
            // Continue without members data - we already initialized with empty array
          }
        }
      }
      
      // If the project is valid but empty or missing key fields, use fallback
      if (!project.value || !project.value.id) {
        console.log('API returned invalid project data, falling back to dummy data');
        const foundProject = dummyProjects.find(p => p.id === projectId);
        if (foundProject) {
          project.value = foundProject;
          console.log('Project found in dummy data:', project.value);
        } else {
          error.value = `Project with ID ${projectId} not found`;
          console.error(`Project not found with ID: ${projectId}`);
        }
      }
    } else {
      console.log('API returned no data, falling back to dummy data');
      // Fallback to dummy data (for development only)
      const foundProject = dummyProjects.find(p => p.id === projectId);
      if (foundProject) {
        project.value = foundProject;
        console.log('Project found in dummy data:', project.value);
      } else {
        error.value = `Project with ID ${projectId} not found`;
        console.error(`Project not found with ID: ${projectId}`);
      }
    }
  } catch (err: any) {
    console.error('Error fetching project:', err);
    error.value = `Error fetching project: ${err.message || 'Unknown error'}`;
    
    // Try fallback to dummy data
    try {
      const projectId = Number(route.params.id);
      const foundProject = dummyProjects.find(p => p.id === projectId);
      if (foundProject) {
        project.value = foundProject;
        console.log('Project found in dummy data after API error:', project.value);
        error.value = ''; // Clear error if we found it in dummy data
      }
    } catch (fallbackErr) {
      console.error('Error in fallback search:', fallbackErr);
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadProject();
});

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

// Function to add new team member
const addTeamMember = async () => {
  addMemberError.value = ''
  
  if (!newMember.user_id) {
    addMemberError.value = 'Please select a user'
    return
  }
  
  addingMember.value = true
  
  try {
    // Call the API to add the member
    await projectService.addMember(Number(route.params.id), {
      user_id: Number(newMember.user_id),
      role: newMember.role
    })
    
    // Refresh the members list
    const membersResponse = await projectService.getMembers(Number(route.params.id))
    if (membersResponse && membersResponse.data) {
      const membersData = membersResponse.data.data || membersResponse.data
      if (Array.isArray(membersData)) {
        project.value.members = membersData
      }
    }
    
    // Reset form
    newMember.user_id = ''
    newMember.role = 'member'
    showAddMemberForm.value = false
  } catch (error: any) {
    console.error('Error adding team member:', error)
    addMemberError.value = error.message || 'Failed to add team member'
  } finally {
    addingMember.value = false
  }
}

// Format date untuk tampilan yang lebih user-friendly
const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  
  // Remove any time component and timezone info
  const date = new Date(dateString.split('T')[0]);
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
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
    
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p class="text-gray-600">{{ loadingMessage }}</p>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md mb-4">
      <p>{{ error }}</p>
      <button 
        @click="loadProject" 
        class="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
      >
        Retry Loading
      </button>
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
                  <div class="font-medium">{{ formatDate(project.deadline) }}</div>
                </div>
                
                <div>
                  <div class="text-sm text-gray-500 mb-1">Progress</div>
                  <ProjectProgressChart 
                    :progress="project.progress" 
                    :status="project.status"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-medium text-gray-900">Team Members</h3>
                <button 
                  v-if="authStore.isAdmin || authStore.isProjectManager"
                  @click="showAddMemberForm = !showAddMemberForm" 
                  class="text-sm text-primary hover:text-primary-dark"
                >
                  {{ showAddMemberForm ? 'Cancel' : 'Add Member' }}
                </button>
              </div>
              
              <!-- Add Member Form -->
              <div v-if="showAddMemberForm" class="bg-gray-50 p-3 rounded-md mb-3">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Add Team Member</h4>
                
                <div v-if="addMemberError" class="text-red-600 text-xs mb-2">
                  {{ addMemberError }}
                </div>
                
                <div class="space-y-2">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">User ID</label>
                    <input 
                      v-model="newMember.user_id" 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
                      placeholder="Enter user ID"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Role</label>
                    <select 
                      v-model="newMember.role" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option v-for="role in availableRoles" :key="role" :value="role">
                        {{ role.charAt(0).toUpperCase() + role.slice(1) }}
                      </option>
                    </select>
                  </div>
                  
                  <button 
                    @click="addTeamMember" 
                    class="w-full btn btn-primary text-sm"
                    :disabled="addingMember"
                  >
                    <span v-if="addingMember">Adding...</span>
                    <span v-else>Add Member</span>
                  </button>
                </div>
              </div>
              
              <div class="space-y-3">
                <div v-if="!project.members || project.members.length === 0" class="text-gray-500 text-sm">
                  No team members assigned to this project yet.
                </div>
                <div 
                  v-else
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
        
        <div v-if="!project.tasks || project.tasks.length === 0" class="p-6 text-center">
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