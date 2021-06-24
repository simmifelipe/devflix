import axios from 'axios';

export const baseURL = 'http://10.0.0.109:3333';

const api = axios.create({
  baseURL,
});

export default api;
