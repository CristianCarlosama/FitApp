import api from "./api";


export const getRutinas = async () => {
  const res = await api.get("/rutinas");
  return res.data;
};

export const createRutina = async (rutina: any) => {
  const res = await api.post("/rutinas", rutina);
  return res.data;
};

export const updateRutina = async (id: number, rutina: any) => {
  const res = await api.put(`/rutinas/${id}`, rutina);
  return res.data;
};

export const deleteRutina = async (id: number) => {
  await api.delete(`/rutinas/${id}`);
};