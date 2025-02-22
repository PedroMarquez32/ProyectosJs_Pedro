const API_URL = 'http://localhost:3000/api';

// Función auxiliar para hacer peticiones
const fetchWithCredentials = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
};

// Servicios de autenticación
export const authService = {
  register: (userData) => 
    fetchWithCredentials('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    fetchWithCredentials('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    fetchWithCredentials('/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () =>
    fetchWithCredentials('/users/me'),
};

// Servicios de películas
export const movieService = {
  getPopularMovies: (page = 1) =>
    fetchWithCredentials(`/movies/popular?page=${page}`),

  getMovieDetails: (id) =>
    fetchWithCredentials(`/movies/${id}`),

  toggleFavorite: (movieId) =>
    fetchWithCredentials('/user/favorites', {
      method: 'POST',
      body: JSON.stringify({ movieId }),
    }),

  addReview: (movieId, review) =>
    fetchWithCredentials('/user/reviews', {
      method: 'POST',
      body: JSON.stringify({ movieId, ...review }),
    }),

  getMovieReviews: (movieId) =>
    fetchWithCredentials(`/movies/${movieId}/reviews`),

  getUserFavorites: () =>
    fetchWithCredentials('/user/favorites'),

  getUserReviews: () =>
    fetchWithCredentials('/user/reviews'),

  deleteReview: (reviewId) =>
    fetchWithCredentials(`/user/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }),

  searchMovies: (query) =>
    fetchWithCredentials(`/movies/search?query=${encodeURIComponent(query)}`),
};

const api = {
  request: async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, config);
      
      if (!response.ok) {
        // Si el token expiró o es inválido
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Sesión expirada');
        }
        throw new Error('Error en la petición');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en la petición:', error);
      throw error;
    }
  },

  // Métodos específicos
  get: (endpoint) => api.request(endpoint),
  
  post: (endpoint, data) => api.request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint, data) => api.request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint) => api.request(endpoint, {
    method: 'DELETE',
  }),
};

export default api; 