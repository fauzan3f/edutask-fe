<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const error = ref('')
const isLoading = ref(false)
const router = useRouter()

const register = async () => {
  if (!name.value || !email.value || !password.value || !passwordConfirmation.value) {
    error.value = 'Please fill in all fields'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match'
    return
  }

  try {
    isLoading.value = true
    error.value = ''
    
    const response = await axios.post('http://127.0.0.1:8000/api/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })
    
    // Store token in localStorage
    localStorage.setItem('token', response.data.access_token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    // Redirect to dashboard
    router.push('/dashboard')
  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else if (err.response && err.response.data && err.response.data.errors) {
      const errors = err.response.data.errors
      const firstError = Object.values(errors)[0]
      error.value = Array.isArray(firstError) ? firstError[0] : 'Validation failed'
    } else {
      error.value = 'Failed to register. Please try again.'
    }
  } finally {
    isLoading.value = false
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
        <div v-if="error" class="bg-red-50 text-red-500 p-4 rounded-md text-sm">
          {{ error }}
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Full name</label>
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

        <div>
          <label for="password-confirmation" class="block text-sm font-medium text-gray-700">
            Confirm Password
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