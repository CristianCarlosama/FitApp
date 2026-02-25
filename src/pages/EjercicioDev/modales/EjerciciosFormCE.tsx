import React, { useState, useEffect } from "react";
import Text from "../../../components/Texts";

interface Props {
  userRole: string | null;
  ejercicio?: any;
  onClose: () => void;
  onSuccess: (data: any, isEdit: boolean) => void;
}

const EjercicioForm: React.FC<Props> = ({ 
  userRole, 
  ejercicio, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    clase: "",
    foto_1: "", // 👈 Cambiado de imagen_url a foto_1 para que Laravel lo acepte
    descripcion: ""
  });

  useEffect(() => {
    if (ejercicio) {
      setFormData({
        nombre: ejercicio.nombre || "",
        clase: ejercicio.clase || "",
        foto_1: ejercicio.foto_1 || ejercicio.imagen_url || "", 
        descripcion: ejercicio.descripcion || ""
      });
    }
  }, [ejercicio]);

  const handleSubmit = () => {
    // Estructura EXACTA que pide tu EjercicioController en el método store/update
    const dataParaBackend = {
      ...formData,
      // Añadimos campos opcionales que el backend valida para evitar el 403 por validación fallida
      rutina_id: null,
      series: 0,
      repeticiones: 0,
      descanso: 0
    };

    if (!formData.nombre || !formData.clase) {
      alert("Pana, el nombre y la clase son obligatorios.");
      return;
    }

    onSuccess(dataParaBackend, !!ejercicio);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#161925] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-6">
          <Text size="2xl" weight="black" variant="gradient" className="uppercase">
            {ejercicio ? "Editar Ejercicio" : "Nuevo Ejercicio"}
          </Text>
          <span className="text-[9px] bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-black uppercase tracking-widest">
            {userRole}
          </span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Nombre</label>
            <input 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-purple-500 transition-all"
              placeholder="Ej: Press Banca"
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Categoría</label>
            <select 
              className="w-full bg-[#1b1f2d] border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all text-white"
              value={formData.clase}
              onChange={e => setFormData({...formData, clase: e.target.value})}
            >
              <option value="" disabled>Seleccionar...</option>
              <option value="pecho">Pecho</option>
              <option value="espalda">Espalda</option>
              <option value="piernas">Piernas</option>
              <option value="hombros">Hombros</option>
              <option value="brazos">Brazos</option>
              <option value="cardio">Cardio</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">URL del GIF/Imagen</label>
            <input 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-purple-500 transition-all"
              placeholder="https://..."
              value={formData.foto_1}
              onChange={e => setFormData({...formData, foto_1: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Descripción Técnica</label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-purple-500 transition-all h-28 resize-none"
              placeholder="Instrucciones del ejercicio..."
              value={formData.descripcion}
              onChange={e => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <button 
            onClick={handleSubmit}
            className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-500/20"
          >
            {ejercicio ? "Actualizar Ejercicio" : "Crear Ejercicio"}
          </button>
          <button onClick={onClose} className="text-gray-500 font-bold uppercase text-[10px] hover:text-white transition-all py-2">
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default EjercicioForm;