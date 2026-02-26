import api from './api'; 


export const register = async (name: string, email: string, password: string) => {
  const res = await api.post('/register', { name, email, password });
  return res.data;
};

export const login = async (login: string, password: string) => {
  const res = await api.post('/login', { login, password });
  
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  
  return res.data;
};

export const me = async () => {
  const res = await api.get('/me');
  return res.data;
};