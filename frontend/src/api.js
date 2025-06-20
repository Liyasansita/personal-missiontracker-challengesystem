import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tracker-gioz.onrender.com/api',
});

export default API;

