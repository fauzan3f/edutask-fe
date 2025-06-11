import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
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
  getAll: () => 
    api.get('/projects'),
  
  get: (id: number) => 
    api.get(`/projects/${id}`),
  
  create: (projectData: any) => 
    api.post('/projects', projectData),
  
  update: (id: number, projectData: any) => {
    console.log('API update called with:', { id, projectData });
    console.log('Progress type:', typeof projectData.progress);
    return api.put(`/projects/${id}`, projectData);
  },
  
  delete: (id: number) => 
    api.delete(`/projects/${id}`),
  
  getMembers: (id: number) => 
    api.get(`/projects/${id}/members`),
  
  addMember: (id: number, userData: any) => 
    api.post(`/projects/${id}/members`, userData),
  
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
  getTaskComments: (taskId: number) => 
    api.get(`/comments/task/${taskId}`),
  
  create: (commentData: any) => 
    api.post('/comments', commentData),
  
  update: (id: number, commentData: any) => 
    api.put(`/comments/${id}`, commentData),
  
  delete: (id: number) => 
    api.delete(`/comments/${id}`),
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

export default api; 