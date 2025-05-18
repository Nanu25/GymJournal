// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? '/api' // Use relative path in production - this will work with both local and Heroku
    : 'http://localhost:3000/api');

export { API_BASE_URL }; 