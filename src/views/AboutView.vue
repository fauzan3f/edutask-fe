<script setup lang="ts">
</script>

<template>
  <div class="about">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-3xl font-bold text-center mb-8">About EduTask</h1>
      
      <div class="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Application Description</h2>
          <p class="text-gray-700 mb-4">
            EduTask is a project and task management application designed specifically for educational needs. 
            This application allows users to create projects, manage tasks, and collaborate with teams.
          </p>
          <p class="text-gray-700">
            Key features include JWT authentication, multi-role user management (Admin, Project Manager, Team Member), 
            project and task CRUD, task status updates, team comments on tasks, summary dashboard, and profile editing.
          </p>
        </div>
      </div>
      
      <div class="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Technologies Used</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="text-lg font-medium mb-2">Backend</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Laravel (PHP Framework)</li>
                <li>JWT Authentication</li>
                <li>MySQL Database</li>
                <li>RESTful API</li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-medium mb-2">Frontend</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Vue.js</li>
                <li>Tailwind CSS</li>
                <li>Axios for HTTP requests</li>
                <li>Vue Router</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      

    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
