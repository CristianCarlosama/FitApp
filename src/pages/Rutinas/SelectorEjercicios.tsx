import React, { useEffect, useState } from "react";
import { getEjercicios } from "../../services/ejercicios";
import Text from "../../components/Texts";
import { FaSearch, FaTimes } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (ejercicio: any) => void;
}

const SelectorEjercicios: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    if (isOpen) {
      getEjercicios().then(setEjercicios);
    }
  }, [isOpen]);

  const ejerciciosFiltrados = ejercicios.filter(ej => 
    ej.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    ej.clase?.toLowerCase().includes(filtro.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-[#161925] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <Text size="xl" weight="black" variant="gradient" className="uppercase tracking-tighter">
              Añadir Ejercicio
            </Text>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Selecciona una técnica para tu rutina</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        {/* Buscador */}
        <div className="p-4 bg-white/5">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input 
              type="text"
              placeholder="Buscar por nombre o músculo..."
              className="w-full bg-black/20 border border-white/10 py-3 pl-12 pr-4 rounded-xl text-sm outline-none focus:border-purple-500 transition-all"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de Ejercicios */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 scrollbar-hide">
          {ejerciciosFiltrados.map((ej) => (
            <div
              key={ej.id}
              onClick={() => {
                onSelect(ej);
                onClose();
              }}
              className="group bg-white/5 border border-white/5 p-3 rounded-3xl cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300"
            >
              <div className="relative h-32 w-full mb-3 overflow-hidden rounded-2xl">
                <img
                  src={ej.foto_1 || ej.imagen_url || "https://via.placeholder.com/150"}
                  alt={ej.nombre}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                  <span className="text-[8px] bg-black/60 backdrop-blur-md text-purple-400 px-2 py-1 rounded-lg font-black uppercase">
                    {ej.clase}
                  </span>
                </div>
              </div>
              <h3 className="font-black text-sm uppercase tracking-tight mb-1 group-hover:text-purple-400 transition-colors">
                {ej.nombre}
              </h3>
              <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">
                {ej.descripcion}
              </p>
            </div>
          ))}
          
          {ejerciciosFiltrados.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Text className="text-gray-600 uppercase text-xs font-bold">No se encontraron ejercicios</Text>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 text-center">
          <button onClick={onClose} className="text-[10px] font-black uppercase text-gray-500 hover:text-white transition-all">
            Cerrar Galería
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectorEjercicios;