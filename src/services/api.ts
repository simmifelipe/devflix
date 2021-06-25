import axios from 'axios';

export const baseURL = 'http://172.16.1.43:3333';
// export const baseURL = 'http://10.0.0.109:3333';

//
const api = axios.create({
  baseURL,
});

export default api;
