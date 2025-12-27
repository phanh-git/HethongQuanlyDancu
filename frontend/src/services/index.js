import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const dashboardService = {
  getStatistics: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getRecentActivities: async () => {
    const response = await api.get('/dashboard/activities');
    return response.data;
  }
};

export const householdService = {
  getAll: async (params) => {
    const response = await api.get('/households', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/households/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/households', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/households/${id}`, data);
    return response.data;
  },

  split: async (id, data) => {
    const response = await api.post(`/households/${id}/split`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/households/${id}`);
    return response.data;
  }
};

export const populationService = {
  getAll: async (params) => {
    const response = await api.get('/population', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/population/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/population', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/population/${id}`, data);
    return response.data;
  },

  markAsDeceased: async (id, data) => {
    const response = await api.post(`/population/${id}/death`, data);
    return response.data;
  },

  markAsMovedOut: async (id, data) => {
    const response = await api.post(`/population/${id}/moveout`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/population/${id}`);
    return response.data;
  }
};

export const temporaryResidenceService = {
  getAll: async (params) => {
    const response = await api.get('/temporary-residence', { params });
    return response.data;
  },

  getExpiring: async () => {
    const response = await api.get('/temporary-residence/expiring');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/temporary-residence', data);
    return response.data;
  },

  extend: async (id, data) => {
    const response = await api.post(`/temporary-residence/${id}/extend`, data);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.post(`/temporary-residence/${id}/cancel`);
    return response.data;
  }
};

export const complaintService = {
  getAll: async (params) => {
    const response = await api.get('/complaints', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/complaints', data);
    return response.data;
  },

  updateStatus: async (id, data) => {
    const response = await api.put(`/complaints/${id}/status`, data);
    return response.data;
  },

  merge: async (data) => {
    const response = await api.post('/complaints/merge', data);
    return response.data;
  },

  assign: async (id, data) => {
    const response = await api.put(`/complaints/${id}/assign`, data);
    return response.data;
  },

  getStats: async (params) => {
    const response = await api.get('/complaints/stats', { params });
    return response.data;
  }
};

export const reportService = {
  getPopulationByAge: async (params) => {
    const response = await api.get('/reports/population-by-age', { params });
    return response.data;
  },

  downloadPopulationExcel: async (params) => {
    const response = await api.get('/reports/population-by-age', {
      params: { ...params, format: 'excel' },
      responseType: 'blob'
    });
    return response.data;
  },

  getQuarterlyComplaints: async (params) => {
    const response = await api.get('/reports/complaints-quarterly', { params });
    return response.data;
  },

  getHouseholds: async (params) => {
    const response = await api.get('/reports/households', { params });
    return response.data;
  },

  downloadHouseholdExcel: async () => {
    const response = await api.get('/reports/households', {
      params: { format: 'excel' },
      responseType: 'blob'
    });
    return response.data;
  }
};
