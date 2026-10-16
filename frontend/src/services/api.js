const API_BASE = '/api';

/**
 * Core fetch wrapper with auth header injection and standardized error handling
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

// Authentication API
export const authApi = {
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => request('/auth/me'),
};

// Tasks API
export const taskApi = {
  // Get all tasks with query params (status, priority, search, tag, dueFilter, sortBy, order)
  getTasks: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    return request(`/tasks${queryString ? `?${queryString}` : ''}`);
  },

  getStats: () => request('/tasks/stats'),

  getById: (id) => request(`/tasks/${id}`),

  createTask: (taskData) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),

  updateTask: (id, taskData) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }),

  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};
