<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const error = computed(() => authStore.error)
const isLoading = computed(() => authStore.loading)

const login = async () => {
  if (!email.value || !password.value) {
    return
  }

  const success = await authStore.login(email.value, password.value)
  
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
        <h1 class="text-3xl font-extrabold text-gray-900">Sign in to EduTask</h1>
        <p class="mt-2 text-sm text-gray-600">
          Or
          <router-link to="/register" class="font-medium text-primary hover:text-primary-dark">
            create a new account
          </router-link>
        </p>
      </div>

      <form @submit.prevent="login" class="mt-8 space-y-6">
        <div v-if="error" class="bg-red-50 text-red-500 p-4 rounded-md text-sm">
          {{ error }}
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="input w-full mt-1"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="input w-full mt-1"
            placeholder="••••••••"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary hover:text-primary-dark">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="btn btn-primary w-full flex justify-center"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template> 