import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.16.1.43:3333',
});

export default api;
