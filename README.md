# EduTask - Project Management System (Frontend)

EduTask is a web-based project management system specifically designed for academic environments. This frontend is developed with Vue 3 and TypeScript to provide a responsive and intuitive user interface.

## Key Features

- **User Authentication**: Login, registration, and authorization with JWT.
- **Multi-role User Interface**: Tailored interfaces for Admin, Project Manager, and Team Members.
- **Project Management**: Create, view, edit, and delete projects.
- **Task Management**: Track tasks with various statuses and priorities.
- **Team Collaboration**: View team members and their roles within projects.
- **Progress Visualization**: Interactive charts using Chart.js to track project progress.
- **Responsive Interface**: Design that works well on both desktop and mobile devices.
- **Notifications**: Notification system for deadlines and updates.

## Technology Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** as the build tool
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **Chart.js** for data visualization
- **Pinia** for state management
- **Vue Router** for navigation

## Application Structure

```
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable Vue components
│   ├── charts/     # Visualization components with Chart.js
│   ├── forms/      # Form components
│   ├── layout/     # Layout components (header, sidebar, etc.)
│   └── ui/         # UI components (buttons, cards, etc.)
├── router/         # Vue Router configuration
├── services/       # Services for API calls and business logic
├── stores/         # Pinia stores for state management
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── views/          # Vue page components
```

## Data Visualization with Chart.js

EduTask utilizes Chart.js to visualize project progress:

- **Donut Chart**: Displays the percentage of project completion.
- **Dynamic Colors**: Chart colors change according to the project status:
  - **Planning**: Blue (#3498db)
  - **In Progress**: Orange (#f39c12)
  - **Completed**: Green (#2ecc71)
- **Reusable Component**: `ProjectProgressChart.vue` can be used across the application.
- **Interactive**: Tooltips display detailed information on hover.

### Chart Usage Example

```vue
<template>
  <ProjectProgressChart 
    :progress="project.progress" 
    :status="project.status"
  />
</template>

<script setup lang="ts">
import ProjectProgressChart from '@/components/ProjectProgressChart.vue'
</script>
```

## Installation & Setup

### Prerequisites
- Node.js >= 16.0
- NPM or Yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/edutask-frontend.git
   cd edutask-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

4. **Build for Production**
   ```bash
   npm run build
   ```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

