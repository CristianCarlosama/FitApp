import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const getRutinas = async () => {
  const res = await axios.get(`${API_URL}/rutinas`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const createRutina = async (rutina: any) => {
  const res = await axios.post(`${API_URL}/rutinas`, rutina, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const updateRutina = async (id: number, rutina: any) => {
  const res = await axios.put(`${API_URL}/rutinas/${id}`, rutina, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const deleteRutina = async (id: number) => {
  await axios.delete(`${API_URL}/rutinas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};