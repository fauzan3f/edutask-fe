<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-16">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary">404</h1>
      <h2 class="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
      <p class="text-gray-600 mt-2 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div class="mt-8 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
        <button @click="goBack" class="btn btn-outline-primary">
          Go Back
        </button>
        <button @click="goHome" class="btn btn-primary">
          Go Home
        </button>
      </div>
    </div>
  </div>
</template> 