import React, { useState, useEffect } from "react";
import { createRutina, updateRutina } from "../../services/rutinas";

interface Props {
  rutina?: any;
  onClose: () => void;
}

const RutinaForm: React.FC<Props> = ({ rutina, onClose }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nivel, setNivel] = useState("");
  const [duracion, setDuracion] = useState<number | "">("");

  useEffect(() => {
    if (rutina) {
      setNombre(rutina.nombre);
      setDescripcion(rutina.descripcion || "");
      setNivel(rutina.nivel || "");
      setDuracion(rutina.duracion || "");
    }
  }, [rutina]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = { nombre, descripcion, nivel, duracion };

    if (rutina) {
      await updateRutina(rutina.id, data);
    } else {
      await createRutina(data);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#161925] p-8 rounded-2xl w-[400px] flex flex-col gap-4"
      >
        <h2 className="text-xl font-black uppercase">
          {rutina ? "Editar Rutina" : "Nueva Rutina"}
        </h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="bg-white/5 p-3 rounded-lg"
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="bg-white/5 p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Nivel"
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          className="bg-white/5 p-3 rounded-lg"
        />

        <input
          type="number"
          placeholder="Duración (min)"
          value={duracion}
          onChange={(e) => setDuracion(Number(e.target.value))}
          className="bg-white/5 p-3 rounded-lg"
        />

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="bg-purple-600 px-6 py-2 rounded-lg font-bold"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RutinaForm;