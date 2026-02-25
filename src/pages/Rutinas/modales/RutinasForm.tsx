import React, { useState, useEffect } from "react";
import { createRutina, updateRutina } from "../../../services/rutinas";
import SelectorEjercicios from "../SelectorEjercicios";
import Text from "../../../components/Texts";
import NotificationModal from "../../../components/NotificationModal"; // 👈 Asegúrate de que la ruta sea correcta
import { FaTrash, FaPlus } from "react-icons/fa";

interface Props {
  rutina?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const RutinaForm: React.FC<Props> = ({ rutina, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dificultad, setDificultad] = useState("");
  const [duracion, setDuracion] = useState<number | "">("");
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [openSelector, setOpenSelector] = useState(false);

  // Estado para la notificación
  const [notif, setNotif] = useState<{ open: boolean; title: string; message: string; type: 'success' | 'error' }>({
    open: false,
    title: "",
    message: "",
    type: "success"
  });

  useEffect(() => {
    if (rutina) {
      setNombre(rutina.nombre);
      setDescripcion(rutina.descripcion || "");
      setDificultad(rutina.dificultad || "");
      setDuracion(rutina.duracion || "");
      setEjercicios(
        (rutina.ejercicios || []).map((ej: any) => ({
          ...ej,
          id: ej.id || ej.ejercicio_id,
          series: ej.series || 3,
          repeticiones: ej.repeticiones || 10,
          descanso: ej.descanso || 60,
        }))
      );
    }
  }, [rutina]);

  const handleSelectEjercicio = (ej: any) => {
    if (ejercicios.some((e) => e.id === ej.id)) return;
    setEjercicios([...ejercicios, { ...ej, id: ej.id, series: 3, repeticiones: 10, descanso: 60 }]);
  };

  const handleEjercicioChange = (index: number, field: string, value: any) => {
    const nuevos = [...ejercicios];
    nuevos[index][field] = value;
    setEjercicios(nuevos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const idsFinales = ejercicios.map((ej) => ej.id).filter(id => id);

    if (idsFinales.length === 0) {
      setNotif({ open: true, title: "Ojo ahí", message: "Añade al menos un ejercicio, pana.", type: "error" });
      return;
    }

    const data = { nombre, descripcion, dificultad, duracion, ejercicios: idsFinales };

    try {
      if (rutina) {
        await updateRutina(rutina.id, data);
        setNotif({ open: true, title: "¡Éxito!", message: "Rutina actualizada correctamente.", type: "success" });
      } else {
        await createRutina(data);
        setNotif({ open: true, title: "¡Éxito!", message: "Nueva rutina creada. ¡A darle!", type: "success" });
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);

    } catch (err) {
      setNotif({ open: true, title: "Error", message: "Algo salió mal al guardar la rutina.", type: "error" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#161925] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide">
        
        <Text size="2xl" weight="black" variant="gradient" className="uppercase text-center mb-6">
          {rutina ? "Editar Rutina" : "Nueva Rutina"}
        </Text>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all text-white"
            placeholder="Nombre de la Rutina"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <select
            className="w-full bg-[#161925] border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all text-gray-400"
            value={dificultad}
            onChange={(e) => setDificultad(e.target.value)}
            required
          >
            <option value="">Seleccionar Dificultad</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          <input
            type="number"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all text-white"
            placeholder="Duración aprox (min)"
            value={duracion}
            onChange={(e) => setDuracion(Number(e.target.value))}
          />

          <textarea
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all h-24 resize-none text-white"
            placeholder="Descripción de la rutina"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <div className="pt-4 border-t border-white/5">
            <div className="flex justify-between items-center mb-4">
              <Text size="sm" weight="black" className="uppercase text-gray-400">Ejercicios</Text>
              <button
                type="button"
                onClick={() => setOpenSelector(true)}
                className="bg-purple-600/20 text-purple-400 p-2 rounded-xl hover:bg-purple-600 hover:text-white transition-all"
              >
                <FaPlus size={12} />
              </button>
            </div>

            <div className="space-y-3">
              {ejercicios.map((ej, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-purple-400">{ej.nombre}</span>
                    <button 
                      type="button"
                      onClick={() => setEjercicios(ejercicios.filter((_, i) => i !== index))}
                      className="text-gray-600 hover:text-red-500"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      className="bg-black/40 p-2 rounded-lg text-xs text-center outline-none border border-white/5 focus:border-purple-500 text-white"
                      value={ej.series}
                      onChange={(e) => handleEjercicioChange(index, "series", e.target.value)}
                    />
                    <input
                      type="number"
                      className="bg-black/40 p-2 rounded-lg text-xs text-center outline-none border border-white/5 focus:border-purple-500 text-white"
                      value={ej.repeticiones}
                      onChange={(e) => handleEjercicioChange(index, "repeticiones", e.target.value)}
                    />
                    <input
                      type="number"
                      className="bg-black/40 p-2 rounded-lg text-xs text-center outline-none border border-white/5 focus:border-purple-500 text-white"
                      value={ej.descanso}
                      onChange={(e) => handleEjercicioChange(index, "descanso", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <button
              type="submit"
              className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
            >
              Guardar Rutina
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 font-bold uppercase text-[10px] hover:text-white transition-all py-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Selector de ejercicios */}
      <SelectorEjercicios
        isOpen={openSelector}
        onClose={() => setOpenSelector(false)}
        onSelect={handleSelectEjercicio}
      />

      {/* MODAL DE NOTIFICACIÓN REUTILIZABLE */}
      <NotificationModal
        isOpen={notif.open}
        title={notif.title}
        message={notif.message}
        type={notif.type}
        onClose={() => setNotif({ ...notif, open: false })}
      />
    </div>
  );
};

export default RutinaForm;