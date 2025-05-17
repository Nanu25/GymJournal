// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://gymjournal-75451ef51cbf.herokuapp.com/api'
    : 'http://localhost:3000/api');

export { API_BASE_URL }; 