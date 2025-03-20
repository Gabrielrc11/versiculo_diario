import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.abibliadigital.com.br/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const login = async (email, password) => {
  const response = await api.put('/users/token', { email, password });
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

export const recoverPassword = async (email) => {
  const response = await api.post(`/users/password/${email}`);
  return response.data;
};

export const getUserInfo = async (token) => {
  const response = await api.get('/users/stats', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteAccount = async (token, email, password) => {
  const response = await api.delete('/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data: {
      email,
      password
    }
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