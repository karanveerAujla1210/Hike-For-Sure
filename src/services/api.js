import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: (data) => api.post('/auth/logout', data),
};

export const candidateAPI = {
  getProfile: () => api.get('/candidates/profile'),
  updateProfile: (data) => api.put('/candidates/profile', data),
  addSkill: (data) => api.post('/candidates/skills', data),
  getSkills: () => api.get('/candidates/skills'),
};

export const jobAPI = {
  createJob: (data) => api.post('/jobs', data),
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  applyToJob: (jobId, data) => api.post(`/jobs/${jobId}/apply`, data),
  getApplications: () => api.get('/applications'),
};

export const messagingAPI = {
  createConversation: (data) => api.post('/conversations', data),
  getConversations: () => api.get('/conversations'),
  sendMessage: (conversationId, data) => api.post(`/conversations/${conversationId}/messages`, data),
  getMessages: (conversationId, params) => api.get(`/conversations/${conversationId}/messages`, { params }),
};

export const subscriptionAPI = {
  getPlans: () => api.get('/plans'),
  subscribe: (data) => api.post('/subscriptions', data),
  getCurrentSubscription: () => api.get('/subscriptions/current'),
};

export const networkingAPI = {
  sendConnectionRequest: (data) => api.post('/connections/request', data),
  acceptConnection: (id) => api.put(`/connections/${id}/accept`),
  getConnections: () => api.get('/connections'),
};

export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

export const companyAPI = {
  getCompany: (slug) => api.get(`/companies/${slug}`),
  followCompany: (id) => api.post(`/companies/${id}/follow`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
};

export default api;
