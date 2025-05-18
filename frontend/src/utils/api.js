const API_BASE_URL = 'http://localhost:8000/api';

export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle validation errors
      if (response.status === 400 && data) {
        const errorMessage = Object.values(data).flat().join(', ');
        throw new Error(errorMessage || 'Validation failed');
      }
      throw new Error(data.error || 'Signup failed');
    }

    // Store tokens
    if (data.tokens) {
      localStorage.setItem('accessToken', data.tokens.access);
      localStorage.setItem('refreshToken', data.tokens.refresh);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store tokens
    if (data.tokens) {
      localStorage.setItem('accessToken', data.tokens.access);
      localStorage.setItem('refreshToken', data.tokens.refresh);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Helper function to get the authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getCourseDetails = async (language, level) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quizzes/?language=${language}&level=${level}`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, clear tokens and throw error
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      throw new Error(data.error || 'Failed to fetch course details');
    }

    if (!data.length) {
      throw new Error('No quiz found for this course');
    }

    return data[0];
  } catch (error) {
    throw error;
  }
};

// Add a function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

// Add a function to logout
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}; 