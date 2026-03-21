import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cms_token');
      localStorage.removeItem('cms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Posts ─────────────────────────────────
export const postsAPI = {
  getAll: (params) => api.get('/posts', { params }),
  getOne: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

// ─── Categories ───────────────────────────
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getOne: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ─── Users ────────────────────────────────
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// ─── Media ────────────────────────────────
export const mediaAPI = {
  getAll: (params) => api.get('/media', { params }),
  upload: (formData) =>
    api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadCV: (formData) =>
    api.post('/media/upload-cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/media/${id}`),
};

// ─── Dashboard ────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

// ─── Portfolio: Profile ───────────────────
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

// ─── Portfolio: Generic CRUD helper ───────
const crudAPI = (resource) => ({
  getAll: () => api.get(`/${resource}`),
  getOne: (id) => api.get(`/${resource}/${id}`),
  create: (data) => api.post(`/${resource}`, data),
  update: (id, data) => api.put(`/${resource}/${id}`, data),
  delete: (id) => api.delete(`/${resource}/${id}`),
});

export const skillsAPI = crudAPI('skills');
export const servicesAPI = crudAPI('services');
export const experiencesAPI = crudAPI('experiences');
export const projectsAPI = crudAPI('projects');
export const statsAPI = crudAPI('stats');
export const researchAPI = crudAPI('research');

export default api;
