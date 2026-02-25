import axios from 'axios';

// Cambia la línea manual por la variable de entorno
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"; 

export const register = async (name: string, email: string, password: string) => {
  const res = await axios.post(
    `${API_URL}/register`,
    { name, email, password }
  );
  return res.data;
};

export const login = async (login: string, password: string) => {
  const res = await axios.post(
    `${API_URL}/login`,
    { login, password });
    localStorage.setItem("token", res.data.token);
  return res.data;
};

export const me = async () => {
  const res = await axios.get(
    `${API_URL}/me`, { withCredentials: true }
  );
  return res.data;
};