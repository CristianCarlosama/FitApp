import React, { useEffect, useState } from "react";
import { getEjercicios } from "../../services/ejercicios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (ejercicio: any) => void;
}

const SelectorEjercicios: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [ejercicios, setEjercicios] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      getEjercicios().then(setEjercicios);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
      <div className="bg-[#1c1f2b] w-[800px] max-h-[80vh] overflow-y-auto rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Seleccionar Ejercicio</h2>

        <div className="grid grid-cols-3 gap-4">
          {ejercicios.map((ej) => (
            <div
              key={ej.id}
              onClick={() => {
                onSelect(ej);
                onClose();
              }}
              className="bg-black/40 p-4 rounded-xl cursor-pointer hover:bg-purple-600/30 transition"
            >
              <img
                src={ej.imagen_url}
                alt={ej.nombre}
                className="h-32 w-full object-cover rounded-lg mb-2"
              />
              <h3 className="font-bold text-sm">{ej.nombre}</h3>
              <p className="text-xs text-gray-400 line-clamp-2">
                {ej.descripcion}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-gray-400"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default SelectorEjercicios;