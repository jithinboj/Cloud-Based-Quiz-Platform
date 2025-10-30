import axios from 'axios';

// Create a new Axios instance
const api = axios.create({
  // IMPORTANT: Replace this with your actual backend server URL
  baseURL: 'http://localhost:5000/api', // Example: 'https://your-api.com/api'
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Axios request interceptor.
 * This function runs before each request is sent.
 * It retrieves the token from localStorage and adds it to the Authorization header.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Configure the header to send the token
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Centralized API functions
// You can add all your API calls here to keep your components clean.

// Authentication calls
export const loginUser = (credentials) => api.post(`/auth/login`, credentials);
export const signupUser = (userData) => api.post(`/auth/signup`, userData);

// Teacher Quiz Management
export const createQuiz = (quizData) => api.post('/quizzes', quizData);
export const getTeacherQuizzes = () => api.get('/quizzes/teacher');
export const deleteQuiz = (quizId) => api.delete(`/quizzes/${quizId}`);

// Student Quiz functions
export const getAvailableQuizzes = () => api.get('/quizzes/student');
export const getQuizById = (quizId) => api.get(`/quizzes/${quizId}`);
export const submitQuiz = (quizId, answers) => api.post(`/quizzes/${quizId}/submit`, { answers });

// Results
export const getStudentResults = () => api.get('/results/student');


export default api;
