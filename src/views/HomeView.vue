<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="w-full">
    <div class="bg-gradient-to-r from-primary-light to-primary-dark text-white py-20 w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Welcome to EduTask</h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          The complete project management platform for educational projects.
          Collaborate, manage tasks, and achieve your academic goals with ease.
        </p>
        <div class="flex justify-center space-x-4">
          <RouterLink to="/register" class="btn bg-white text-primary hover:bg-gray-100">
            Get Started
          </RouterLink>
          <RouterLink to="/login" class="btn bg-transparent border-2 border-white hover:bg-white/10">
            Sign In
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="py-16 w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Features</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card text-center">
            <div class="bg-primary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Project Management</h3>
            <p class="text-gray-600">Organize your educational projects with ease. Set deadlines, track progress, and achieve your goals.</p>
          </div>
          
          <div class="card text-center">
            <div class="bg-primary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p class="text-gray-600">Work together with your classmates. Share files, assign tasks, and communicate effectively.</p>
          </div>
          
          <div class="card text-center">
            <div class="bg-primary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Task Management</h3>
            <p class="text-gray-600">Break down your projects into manageable tasks. Set priorities and track completion status.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gray-100 py-16 w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-8">Ready to get started?</h2>
        <RouterLink to="/register" class="btn btn-primary">
          Create your account now
        </RouterLink>
      </div>
    </div>
  </div>
</template>
