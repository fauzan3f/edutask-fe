import { defineStore } from 'pinia';
import { authService } from '@/services/api';

interface User {
  id: number;
  name: string;
  email: string;
  position?: string;
  department?: string;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  }),

  getters: {
    getUser: (state) => state.user,
    isAdmin: (state) => state.user?.roles.includes('admin') || false,
    isProjectManager: (state) => state.user?.roles.includes('project_manager') || false,
    isTeamMember: (state) => state.user?.roles.includes('team_member') || false,
    hasPermission: (state) => (permission: string) => state.user?.permissions.includes(permission) || false,
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authService.login(email, password);
        const { access_token, user, roles, permissions } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('token', access_token);
        
        // Update state
        this.token = access_token;
        this.user = {
          ...user,
          roles,
          permissions,
        };
        this.isAuthenticated = true;
        
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Failed to login';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(userData: any) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authService.register(userData);
        const { access_token, user, roles, permissions } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('token', access_token);
        
        // Update state
        this.token = access_token;
        this.user = {
          ...user,
          roles,
          permissions,
        };
        this.isAuthenticated = true;
        
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.errors || 'Failed to register';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      
      try {
        // Call logout API if authenticated
        if (this.isAuthenticated) {
          await authService.logout();
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clear local storage and state regardless of API call result
        localStorage.removeItem('token');
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        this.loading = false;
      }
    },

    async fetchUser() {
      if (!this.token) return;
      
      this.loading = true;
      
      try {
        const response = await authService.getUser();
        const { user, roles, permissions } = response.data;
        
        this.user = {
          ...user,
          roles,
          permissions,
        };
      } catch (error: any) {
        if (error.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },

    // Initialize the auth state from localStorage on app start
    init() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
        this.fetchUser();
      }
    },
  },
}); 