import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.abibliadigital.com.br/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const login = async (email, password) => {
  const response = await api.post('/users/auth', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/users', {
    name,
    email,
    password,
    notifications: true
  });
  return response.data;
};

export const getRandomVerse = async (token) => {
  const response = await api.get('/verses/nvi/random', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export default api; 