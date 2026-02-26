import api from "./api"; 

export const getMusculos = async () => {
  try {
    const response = await api.get("/musculos");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener músculos:", error);
    return []; 
  }
};