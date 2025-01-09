import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://eve-backend.mrashid-te.workers.dev/', // Your API base URL
  headers: {
    'Content-Type': 'application/json', 
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Update with your token storage method

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request, token might be expired');
    }

    console.error('Response Error:', error);

    return Promise.reject(error);
  }
);

export default axiosInstance;
