import api from "./api";

export const getEjercicios = async () => {
  const res = await api.get("/ejercicios");
  return res.data;
};

export const createEjercicio = async (ejercicio: any) => {
  const res = await api.post("/ejercicios", ejercicio);
  return res.data;
};

export const updateEjercicio = async (id: number, ejercicio: any) => {
  const res = await api.put(`/ejercicios/${id}`, ejercicio);
  return res.data;
};

export const deleteEjercicio = async (id: number) => {
  await api.delete(`/ejercicios/${id}`);
};

export const calificarEjercicio = async (id: number, puntos: number, user_id: number) => {
  const res = await api.post(`/ejercicios/${id}/calificar`, { puntos, user_id });
  return res.data;
};