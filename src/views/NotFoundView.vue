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
  <div class="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary">404</h1>
      <h2 class="text-3xl font-semibold mt-4 text-gray-800">Page Not Found</h2>
      <p class="mt-2 text-lg text-gray-600">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          @click="goBack"
          class="btn btn-outline-primary"
        >
          Go Back
        </button>
        <button 
          @click="goHome"
          class="btn btn-primary"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
</template> 