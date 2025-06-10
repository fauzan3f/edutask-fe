<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const department = ref('')
const position = ref('')
const validationError = ref('')
const authStore = useAuthStore()
const router = useRouter()

const error = computed(() => authStore.error)
const isLoading = computed(() => authStore.loading)

const register = async () => {
  // Reset validation error
  validationError.value = ''
  
  if (!name.value || !email.value || !password.value || !passwordConfirmation.value) {
    validationError.value = 'Please fill in all required fields'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    validationError.value = 'Passwords do not match'
    return
  }

  const userData = {
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value,
    department: department.value || undefined,
    position: position.value || undefined
  }

  const success = await authStore.register(userData)
  
  if (success) {
    // Redirect to dashboard
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="w-full py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-md">
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-gray-900">Create an account</h1>
        <p class="mt-2 text-sm text-gray-600">
          Or
          <router-link to="/login" class="font-medium text-primary hover:text-primary-dark">
            sign in to your account
          </router-link>
        </p>
      </div>

      <form @submit.prevent="register" class="mt-8 space-y-6">
        <div v-if="validationError || error" class="bg-red-50 text-red-500 p-4 rounded-md text-sm">
          {{ validationError || error }}
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Full name <span class="text-red-500">*</span></label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            class="input w-full mt-1"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address <span class="text-red-500">*</span></label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="input w-full mt-1"
            placeholder="your@email.com"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
            <input
              id="department"
              v-model="department"
              type="text"
              class="input w-full mt-1"
              placeholder="Engineering"
            />
          </div>
          
          <div>
            <label for="position" class="block text-sm font-medium text-gray-700">Position</label>
            <input
              id="position"
              v-model="position"
              type="text"
              class="input w-full mt-1"
              placeholder="Developer"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password <span class="text-red-500">*</span></label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="input w-full mt-1"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label for="password-confirmation" class="block text-sm font-medium text-gray-700">
            Confirm Password <span class="text-red-500">*</span>
          </label>
          <input
            id="password-confirmation"
            v-model="passwordConfirmation"
            type="password"
            required
            class="input w-full mt-1"
            placeholder="••••••••"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="btn btn-primary w-full flex justify-center"
          >
            <span v-if="isLoading">Creating account...</span>
            <span v-else>Create account</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template> 