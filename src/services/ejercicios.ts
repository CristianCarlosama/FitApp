import axios from "axios";

// Cambia la línea manual por la variable de entorno
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const getEjercicios = async () => {
  const res = await axios.get(`${API_URL}/ejercicios`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const createEjercicio = async (ejercicio: any) => {
  const res = await axios.post(`${API_URL}/ejercicios`, ejercicio, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const updateEjercicio = async (id: number, ejercicio: any) => {
  const res = await axios.put(`${API_URL}/ejercicios/${id}`, ejercicio, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const deleteEjercicio = async (id: number) => {
  await axios.delete(`${API_URL}/ejercicios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const calificarEjercicio = async (id: number, puntos: number, user_id: number) => {
  const res = await axios.post(`${API_URL}/ejercicios/${id}/calificar`, { puntos, user_id }, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};