import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔹 1. Importar el hook
import { 
  FaDumbbell, 
  FaFire, 
  FaChevronRight, 
  FaPlay 
} from "react-icons/fa";

import Text from "../../../components/Texts";
import Button from "../../../components/Buttons";
import Modal from "../../../components/Modal";
import Carousel from "../../../components/Carousel";
// --- INTERFACES ---
interface RutinaDetalleProps {
  rutina: any;
  onClose: () => void;
  onStart: (rutina: any) => void;
}

// --- SUB-MODAL DE INFORMACIÓN DEL EJERCICIO ---
const EjercicioInfoModal = ({ exercise, onClose }: any) => {
  const getImageUrl = (url: string | null) => {
    if (!url || url === "null" || url === "undefined") return "";
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_STORAGE_URL;
    return `${baseUrl}/${url}`.replace(/([^:]\/)\/+/g, "$1"); 
  };

  const media = [
    { type: 'image', url: getImageUrl(exercise.foto_1) },
    { type: 'image', url: getImageUrl(exercise.foto_2) },
    { type: 'image', url: getImageUrl(exercise.foto_3) },
    { type: 'video', url: exercise.video_url }
  ].filter(item => item.url && item.url.length > 5);

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      className="!p-0 !max-w-sm overflow-hidden z-[120]"
    >
      <div className="relative h-60 w-full bg-black group">
        <Carousel className="h-full">
          {media.length > 0 ? (
            media.map((item, i) => (
              <div key={i} className="flex-shrink-0 w-full h-full relative">
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    className="w-full h-full object-cover" 
                    alt={`Paso ${i + 1}`} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x400?text=Error+Cargando+Imagen";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-purple-900/20 backdrop-blur-sm">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" className="!rounded-full !w-14 !h-14 shadow-2xl">
                        <FaPlay size={16} className="ml-1" />
                      </Button>
                    </a>
                    <Text size="xs" weight="black" className="uppercase text-white mt-4 opacity-60 tracking-widest text-[9px]">Ver Técnica</Text>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <Text size="xs" className="text-gray-500 italic">Sin multimedia disponible</Text>
            </div>
          )}
        </Carousel>
      </div>
      <div className="p-8">
        <Text size="xl" weight="black" variant="gradient" className="uppercase mb-4 text-center italic tracking-tighter leading-none">
          {exercise.nombre}
        </Text>
        <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 mb-6">
          <Text size="xs" className="text-gray-400 leading-relaxed italic text-center">
            {exercise.descripcion || "Optimiza tu técnica: Controla la fase negativa y siente la contracción máxima."}
          </Text>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-purple-600/10 p-4 rounded-2xl border border-purple-500/20 text-center">
            <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest mb-1">Músculo</span>
            <span className="text-xs font-black uppercase text-white block truncate">{exercise.clase || "General"}</span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
            <span className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Descanso</span>
            <span className="text-xs font-black uppercase text-white">{exercise.pivot?.descanso || exercise.descanso || "60"}S</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// --- MODAL PRINCIPAL ---
const RutinaDetalle: React.FC<RutinaDetalleProps> = ({ rutina, onClose, onStart }) => {
  const navigate = useNavigate(); // 🔹 2. Inicializar la función navigate
  const [selectedEx, setSelectedEx] = useState<any>(null);
  
  const diff = rutina.dificultad?.toLowerCase();
  const diffColor = diff === 'alta' ? 'bg-red-500' : diff === 'media' ? 'bg-orange-500' : 'bg-green-500';

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      className="!p-0 !max-w-lg overflow-hidden flex flex-col"
    >
      <div className="relative h-36 flex-shrink-0 bg-gradient-to-b from-purple-600/30 to-transparent flex items-end px-8 pb-6">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className={`${diffColor} text-[8px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest text-white shadow-lg`}>
              {rutina.dificultad}
            </span>
            <span className="bg-white/5 text-[8px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest border border-white/5 text-gray-400">
              {rutina.duracion || 45} MIN
            </span>
          </div>
          <Text size="2xl" weight="black" className="uppercase tracking-tighter italic leading-none text-white">
            {rutina.nombre}
          </Text>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 pt-2 no-scrollbar max-h-[50vh]">
        <p className="text-gray-500 text-[11px] leading-relaxed border-l-2 border-purple-500/30 pl-4 py-1 italic mb-8">
          {rutina.descripcion || "Protocolo de entrenamiento diseñado para hipertrofia y fuerza máxima."}
        </p>
        
        <Text size="xs" weight="black" className="uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 mb-4">
          <FaDumbbell className="text-purple-500" size={10} /> Lista de Ejercicios
        </Text>

        <div className="space-y-3">
          {rutina.ejercicios?.map((ej: any, i: number) => (
            <div 
              key={i} 
              onClick={() => setSelectedEx(ej)}
              className="group bg-white/[0.02] hover:bg-purple-600/[0.08] border border-white/5 hover:border-purple-500/30 p-4 rounded-2xl flex justify-between items-center cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 bg-black/40 rounded-xl flex items-center justify-center font-black text-[11px] text-purple-500 border border-white/5 group-hover:border-purple-500/30">
                  {i + 1}
                </div>
                <div>
                  <span className="block text-xs font-black uppercase tracking-tight group-hover:text-purple-400 transition-colors text-white">
                    {ej.nombre}
                  </span>
                  <div className="flex gap-2 mt-1 opacity-50">
                    <span className="text-[9px] font-bold uppercase">
                      {ej.pivot?.series || ej.series || 0} Series
                    </span>
                    <span className="text-[9px] text-purple-500">•</span>
                    <span className="text-[9px] font-bold uppercase">
                      {ej.pivot?.repeticiones || ej.repeticiones || 0} Reps
                    </span>
                  </div>
                </div>
              </div>
              <FaChevronRight size={10} className="text-gray-700 group-hover:text-purple-500 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 pt-4 bg-[#161925] border-t border-white/5">
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => {
            navigate('/entrenamientos', { state: { rutina } }); 
            
            if (onStart) onStart(rutina); 
            onClose();
          }}
          className="w-full !rounded-2xl !py-5 flex items-center justify-center gap-3 shadow-purple-500/20 shadow-xl"
        >
          <FaFire size={14} /> 
          <span className="tracking-[0.15em]">COMENZAR ENTRENAMIENTO</span>
        </Button>
      </div>

      {selectedEx && (
        <EjercicioInfoModal 
          exercise={selectedEx} 
          onClose={() => setSelectedEx(null)} 
        />
      )}
    </Modal>
  );
};

export default RutinaDetalle;