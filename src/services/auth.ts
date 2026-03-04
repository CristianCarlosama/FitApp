import api from './api'; 

export const register = async (userData: any) => {
  const res = await api.post('/register', userData);
  return res.data;
};

export const login = async (loginValue: string, passwordValue: string) => {
  const res = await api.post('/login', { login: loginValue, password: passwordValue });
  
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};

export const getRole = (): string | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).rol : null;
};