import React from "react";
import { FaDumbbell, FaFire, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importamos el hook

import Text from "../../../components/Texts";
import Button from "../../../components/Buttons";
import Modal from "../../../components/Modal";
import Carousel from "../../../components/Carousel";
import type { Ejercicio } from "../EjerciciosView";

interface Props {
  exercise: Ejercicio;
  onClose: () => void;
}

const EjercicioDetalleModal: React.FC<Props> = ({ exercise, onClose }) => {
  const navigate = useNavigate();

  const getImageUrl = (url: string | null) => {
    if (!url) return "";
    return url.startsWith('http') ? url : `${import.meta.env.VITE_STORAGE_URL}/${url}`;
  };

  // Lógica para navegar a rutinas con el filtro
  const handleConRutina = () => {
    navigate("/rutinas", { 
      state: { filtroCategoria: exercise.clase } 
    });
    onClose();
  };

  const handleSinRutina = () => {
    // Por ahora solo cerramos o podrías mandarlo a /entrenamientos directo
    console.log("Entrenar sin rutina previa");
    onClose();
  };

  const mediaItems = [
    { type: 'image', url: getImageUrl(exercise.foto_1 || null) },
    { type: 'image', url: getImageUrl(exercise.foto_2 || null) },
    { type: 'image', url: getImageUrl(exercise.foto_3 || null) },
    { type: 'video', url: exercise.video_url }
  ].filter(item => item.url);

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title="" 
      className="!p-0 overflow-hidden !max-w-xl relative" 
    >
      <div className="relative h-72 md:h-80 w-full bg-black group overflow-hidden">
        <Carousel className="h-full">
          {mediaItems.map((item, i) => (
            <div key={i} className="flex-shrink-0 w-full h-full relative">
              {item.type === 'image' ? (
                <img src={item.url} className="w-full h-full object-cover" alt={exercise.nombre} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-purple-900/10 backdrop-blur-md">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" className="!rounded-full !w-16 !h-16 shadow-2xl animate-pulse">
                      <FaPlay size={18} className="ml-1" />
                    </Button>
                  </a>
                  <Text size="xs" weight="black" className="uppercase tracking-widest text-white mt-4 opacity-60 italic">
                    Play Técnica
                  </Text>
                </div>
              )}
            </div>
          ))}
        </Carousel>
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10" />
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

      {/* Sección de botones corregida */}
      <div className="p-8 pt-4">
        <Text size="xs" weight="black" className="uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2 mb-4">
          COMENZAR ENTRENO
        </Text>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleConRutina}
            className="w-full !rounded-2xl !py-5 flex items-center justify-center gap-3 shadow-purple-500/20 shadow-xl"
          >
            <FaDumbbell size={16} />
            <span className="tracking-[0.2em] text-[10px]">CON RUTINA</span>
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSinRutina}
            className="w-full !rounded-2xl !py-5 flex items-center justify-center gap-3 shadow-purple-500/20 shadow-xl"
          >
            <FaDumbbell size={16} />
            <span className="tracking-[0.2em] text-[10px]">SIN RUTINA</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EjercicioDetalleModal;