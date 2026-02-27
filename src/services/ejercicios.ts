import api from "./api";

export const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage";

export const getEjercicios = async () => {
  const res = await api.get("/ejercicios");
  return res.data;
};

export const createEjercicio = async (formData: FormData) => {
  const res = await api.post("/ejercicios", formData);
  return res.data;
};

export const updateEjercicio = async (id: number, formData: FormData) => {
  formData.append("_method", "PUT");
  
  const res = await api.post(`/ejercicios/${id}`, formData);
  return res.data;
};

export const deleteEjercicio = async (id: number) => {
  const res = await api.delete(`/ejercicios/${id}`);
  return res.data;
};

export const calificarEjercicio = async (id: number, puntos: number, user_id: number) => {
  const res = await api.post(`/ejercicios/${id}/calificar`, { puntos, user_id });
  return res.data;
};