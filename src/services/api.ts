import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle 401 Unauthorized errors (token expired, invalid, etc.)
    if (response && response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // If we're not already on the login page, redirect there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) => 
    api.post('/auth/register', userData),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getUser: () => 
    api.get('/auth/me'),
};

// Project services
export const projectService = {
  getAll: () => {
    console.log('Fetching all projects');
    return api.get('/projects').catch(error => {
      console.error('Error fetching all projects:', error);
      throw error;
    });
  },
  
  get: (id: number) => {
    console.log(`Fetching project with ID: ${id}`);
    return api.get(`/projects/${id}`).catch(error => {
      console.error(`Error fetching project with ID ${id}:`, error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    });
  },
  
  create: (projectData: any) => {
    console.log('Creating project with data:', projectData);
    return api.post('/projects', projectData).catch(error => {
      console.error('Error creating project:', error);
      throw error;
    });
  },
  
  update: (id: number, projectData: any) => {
    console.log('API update called with:', { id, projectData });
    console.log('Progress type:', typeof projectData.progress);
    return api.put(`/projects/${id}`, projectData).catch(error => {
      console.error(`Error updating project with ID ${id}:`, error);
      throw error;
    });
  },
  
  delete: (id: number) => {
    console.log(`Deleting project with ID: ${id}`);
    return api.delete(`/projects/${id}`).catch(error => {
      console.error(`Error deleting project with ID ${id}:`, error);
      throw error;
    });
  },
  
  getMembers: (id: number) => {
    console.log(`Fetching members for project ID: ${id}`);
    return api.get(`/projects/${id}/members`).catch(error => {
      console.error(`Error fetching members for project ID ${id}:`, error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    });
  },
  
  addMember: (id: number, userData: any) => {
    console.log(`Adding member to project ID: ${id}`, userData);
    return api.post(`/projects/${id}/members`, userData).catch(error => {
      console.error(`Error adding member to project ID ${id}:`, error);
      throw error;
    });
  },
  
  removeMember: (projectId: number, userId: number) => 
    api.delete(`/projects/${projectId}/members/${userId}`),
  
  updateMemberRole: (projectId: number, userId: number, role: string) => 
    api.put(`/projects/${projectId}/members/${userId}`, { role }),
};

// Task services
export const taskService = {
  getAll: () => 
    api.get('/tasks'),
  
  get: (id: number) => 
    api.get(`/tasks/${id}`),
  
  create: (taskData: any) => 
    api.post('/tasks', taskData),
  
  update: (id: number, taskData: any) => 
    api.put(`/tasks/${id}`, taskData),
  
  delete: (id: number) => 
    api.delete(`/tasks/${id}`),
  
  updateStatus: (id: number, status: string) => 
    api.put(`/tasks/${id}/status`, { status }),
  
  assignTask: (id: number, userId: number) => 
    api.put(`/tasks/${id}/assign`, { user_id: userId }),
};

// Comment services
export const commentService = {
  getTaskComments: (taskId: number) => {
    console.log(`Fetching comments for task ID: ${taskId}`);
    return api.get(`/tasks/${taskId}/comments`).catch(error => {
      console.error(`Error fetching comments for task ID ${taskId}:`, error);
      throw error;
    });
  },
  
  create: (commentData: any) => {
    console.log('Creating comment with data:', commentData);
    const taskId = commentData.task_id;
    // Endpoint yang benar: /tasks/{id}/comments bukan /comments
    return api.post(`/tasks/${taskId}/comments`, { content: commentData.content }).catch(error => {
      console.error('Error creating comment:', error);
      throw error;
    });
  },
  
  update: (id: number, commentData: any) => {
    console.log(`Updating comment with ID: ${id}`, commentData);
    return api.put(`/comments/${id}`, commentData).catch(error => {
      console.error(`Error updating comment with ID ${id}:`, error);
      throw error;
    });
  },
  
  delete: (id: number) => {
    console.log(`Deleting comment with ID: ${id}`);
    return api.delete(`/comments/${id}`).catch(error => {
      console.error(`Error deleting comment with ID ${id}:`, error);
      throw error;
    });
  },
};

// File upload service
export const fileService = {
  upload: (file: File, type: string, relatedId: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('related_id', relatedId.toString());
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getFile: (filename: string) => 
    api.get(`/files/${filename}`),
};

// User services
export const userService = {
  getAll: () => {
    console.log('Fetching all users');
    return api.get('/users').catch(error => {
      console.error('Error fetching all users:', error);
      throw error;
    });
  },
  
  get: (id: number) => {
    console.log(`Fetching user with ID: ${id}`);
    return api.get(`/users/${id}`).catch(error => {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    });
  },
  
  getTaskAssignees: () => {
    console.log('Fetching users for task assignment');
    return api.get('/task-assignees').catch(error => {
      console.error('Error fetching task assignees:', error);
      throw error;
    });
  }
};

export default api; 