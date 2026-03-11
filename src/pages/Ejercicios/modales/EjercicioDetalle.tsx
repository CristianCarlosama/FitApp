import React, { useRef } from "react";
import { FaDumbbell, FaFire, FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

import Text from "../../../components/Texts";
import Button from "../../../components/Buttons";
import Modal from "../../../components/Modal";
import type { Ejercicio } from "../EjerciciosView";

interface Props {
  exercise: Ejercicio;
  onClose: () => void;
}

const EjercicioDetalleModal: React.FC<Props> = ({ exercise, onClose }) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const getImageUrl = (url: string | null) => {
    if (!url || url === "null") return "";
    return url.startsWith('http') ? url : `${import.meta.env.VITE_STORAGE_URL}/${url}`;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleConRutina = () => {
    navigate("/rutinas", { state: { filtroCategoria: exercise.clase } });
    onClose(); 
  };

  const handleSinRutina = () => {
    navigate('/entrenamientos', { 
      state: { 
        rutina: {
          nombre: `Entreno de ${exercise.nombre}`,
          ejercicios: [{ ...exercise, pivot: { series: 3, repeticiones: 12, descanso: 60 } }]
        } 
      } 
    });
    onClose();
  };

  const mediaItems = [
    { type: 'image', url: getImageUrl(exercise.foto_1 || null) },
    { type: 'image', url: getImageUrl(exercise.foto_2 || null) },
    { type: 'image', url: getImageUrl(exercise.foto_3 || null) },
    { type: 'video', url: exercise.video_url }
  ].filter(item => item.url && item.url.length > 5);

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title="" 
      className="!p-0 overflow-hidden !max-w-xl relative" 
    >
      {/* Contenedor Multimedia */}
      <div className="relative h-72 md:h-80 w-full bg-black overflow-hidden">
        
        {/* SCROLL NATIVO */}
        <div 
          ref={scrollRef}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth relative z-10"
        >
          {mediaItems.length > 0 ? (
            mediaItems.map((item, i) => (
              <div key={i} className="min-w-full h-full snap-center relative flex-shrink-0">
                {item.type === 'image' ? (
                  <img src={item.url} className="w-full h-full object-cover" alt={exercise.nombre} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-purple-900/20 backdrop-blur-md">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" className="!rounded-full !w-16 !h-16 shadow-2xl animate-pulse">
                        <FaPlay size={18} className="ml-1" />
                      </Button>
                    </a>
                    <Text size="xs" weight="black" className="uppercase tracking-widest text-white mt-4 opacity-60 italic">Play Técnica</Text>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <Text size="xs" className="text-gray-500 italic uppercase tracking-widest font-black opacity-30">Sin Multimedia</Text>
            </div>
          )}
        </div>

        {mediaItems.length > 1 && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-between px-4">
            <button 
              onClick={() => scroll('left')}
              className="pointer-events-auto p-3 bg-black/30 hover:bg-purple-600/60 text-white rounded-full backdrop-blur-md transition-all border border-white/10"
            >
              <FaChevronLeft size={12} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="pointer-events-auto p-3 bg-black/30 hover:bg-purple-600/60 text-white rounded-full backdrop-blur-md transition-all border border-white/10"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-20" />
      </div>

      <div className="p-8 pb-4">
        <header className="mb-6">
          <Text size="xs" weight="black" variant="gradient" className="uppercase tracking-widest mb-2 italic">
            {exercise.clase}
          </Text>
          <Text size="3xl" weight="black" className="uppercase tracking-tighter italic leading-none">
            {exercise.nombre}
          </Text>
        </header>

        <div className="bg-white/[0.02] p-5 rounded-[2rem] border border-white/5 mb-8">
          <Text size="xs" className="text-gray-400 leading-relaxed italic border-l-2 border-purple-500 pl-4">
            {exercise.descripcion || "Enfoque en la fase excéntrica para maximizar el reclutamiento de fibras."}
          </Text>
        </div>

        <div className="space-y-4">
          <Text size="xs" weight="black" className="uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
            <FaFire className="text-purple-500" size={10} /> Arsenal Muscular
          </Text>
          <div className="flex flex-wrap gap-2">
            <div className="bg-purple-600/10 border border-purple-500/20 px-4 py-2.5 rounded-2xl flex items-center gap-3">
              <span className="text-xs font-black text-white uppercase">{exercise.clase}</span>
              <span className="text-[8px] font-black text-purple-400 uppercase bg-purple-500/20 px-2 py-0.5 rounded-md italic">Master</span>
            </div>
            {exercise.musculos_secundarios?.map((m, i) => (
              <div key={i} className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3">
                <span className="text-xs font-black text-gray-500 uppercase">{m.nombre}</span>
                <span className={`text-[8px] font-black uppercase ${m.intensidad === 'Alto' ? 'text-purple-400' : 'text-blue-400'} bg-white/5 px-2 py-0.5 rounded-md`}>
                  {m.intensidad}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 pt-4">
        <Text size="xs" weight="black" className="uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2 mb-4">
          COMENZAR ENTRENO
        </Text>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="primary" size="sm" onClick={handleConRutina} className="w-full !rounded-2xl !py-5 flex flex-col items-center justify-center gap-1 shadow-purple-500/20 shadow-xl group/btn">
            <FaDumbbell size={16} className="group-hover/btn:rotate-12 transition-transform" />
            <span className="tracking-[0.2em] text-[10px]">CON RUTINA</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handleSinRutina} className="w-full !rounded-2xl !py-5 flex flex-col items-center justify-center gap-1 shadow-purple-500/20 shadow-xl group/btn">
            <FaFire size={16} className="group-hover/btn:scale-110 transition-transform" />
            <span className="tracking-[0.2em] text-[10px]">SIN RUTINA</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EjercicioDetalleModal;