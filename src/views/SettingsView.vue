<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const activeTab = ref('account')
const isLoading = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')

// Account settings
const emailNotifications = ref(true)
const desktopNotifications = ref(true)
const taskReminders = ref(true)
const darkMode = ref(false)
const language = ref('english')

// Security settings
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Available languages
const languages = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'indonesian', label: 'Indonesian' }
]

const saveAccountSettings = async () => {
  isLoading.value = true
  saveSuccess.value = false
  saveError.value = ''
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (error) {
    saveError.value = 'Failed to save settings'
  } finally {
    isLoading.value = false
  }
}

const saveSecuritySettings = async () => {
  if (!currentPassword.value) {
    saveError.value = 'Current password is required'
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    saveError.value = 'New passwords do not match'
    return
  }
  
  isLoading.value = true
  saveSuccess.value = false
  saveError.value = ''
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    saveSuccess.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (error) {
    saveError.value = 'Failed to update password'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
    
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <div class="flex -mb-px">
          <button 
            @click="activeTab = 'account'"
            :class="[
              'py-4 px-6 text-sm font-medium whitespace-nowrap',
              activeTab === 'account' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Account Preferences
          </button>
          <button 
            @click="activeTab = 'security'"
            :class="[
              'py-4 px-6 text-sm font-medium whitespace-nowrap',
              activeTab === 'security' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Security
          </button>
        </div>
      </div>
      
      <div class="p-6">
        <div v-if="saveSuccess" class="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
          Settings saved successfully!
        </div>
        
        <div v-if="saveError" class="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {{ saveError }}
        </div>
        
        <!-- Account Preferences Tab -->
        <div v-if="activeTab === 'account'">
          <form @submit.prevent="saveAccountSettings" class="space-y-6">
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label for="email-notifications" class="block text-sm font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p class="text-xs text-gray-500">Receive email notifications for task assignments, comments, and updates.</p>
                  </div>
                  <div class="ml-4">
                    <input 
                      id="email-notifications" 
                      v-model="emailNotifications" 
                      type="checkbox" 
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <label for="desktop-notifications" class="block text-sm font-medium text-gray-700">
                      Desktop Notifications
                    </label>
                    <p class="text-xs text-gray-500">Receive desktop notifications when you're using the application.</p>
                  </div>
                  <div class="ml-4">
                    <input 
                      id="desktop-notifications" 
                      v-model="desktopNotifications" 
                      type="checkbox" 
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <label for="task-reminders" class="block text-sm font-medium text-gray-700">
                      Task Reminders
                    </label>
                    <p class="text-xs text-gray-500">Receive reminders for upcoming task deadlines.</p>
                  </div>
                  <div class="ml-4">
                    <input 
                      id="task-reminders" 
                      v-model="taskReminders" 
                      type="checkbox" 
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Appearance</h2>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label for="dark-mode" class="block text-sm font-medium text-gray-700">
                      Dark Mode
                    </label>
                    <p class="text-xs text-gray-500">Use a darker color scheme for the application.</p>
                  </div>
                  <div class="ml-4">
                    <input 
                      id="dark-mode" 
                      v-model="darkMode" 
                      type="checkbox" 
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Language</h2>
              
              <div class="space-y-4">
                <div>
                  <label for="language" class="block text-sm font-medium text-gray-700">
                    Preferred Language
                  </label>
                  <select
                    id="language"
                    v-model="language"
                    class="input w-full mt-1"
                  >
                    <option 
                      v-for="option in languages" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isLoading"
                class="btn btn-primary"
              >
                <span v-if="isLoading">Saving...</span>
                <span v-else>Save Settings</span>
              </button>
            </div>
          </form>
        </div>
        
        <!-- Security Tab -->
        <div v-else-if="activeTab === 'security'">
          <form @submit.prevent="saveSecuritySettings" class="space-y-6">
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
              
              <div class="space-y-4">
                <div>
                  <label for="current-password" class="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    v-model="currentPassword"
                    type="password"
                    class="input w-full mt-1"
                    required
                  />
                </div>
                
                <div>
                  <label for="new-password" class="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    v-model="newPassword"
                    type="password"
                    class="input w-full mt-1"
                    required
                  />
                </div>
                
                <div>
                  <label for="confirm-password" class="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    v-model="confirmPassword"
                    type="password"
                    class="input w-full mt-1"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isLoading"
                class="btn btn-primary"
              >
                <span v-if="isLoading">Updating...</span>
                <span v-else>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template> 