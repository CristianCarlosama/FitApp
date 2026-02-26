import React from "react";
import Text from "../../../components/Texts";
import { FaTimes, FaDumbbell, FaFire, FaPlay } from "react-icons/fa";
import type { Ejercicio } from "../EjerciciosView";

interface Props {
  exercise: Ejercicio;
  onClose: () => void;
}

const EjercicioDetalleModal: React.FC<Props> = ({ exercise, onClose }) => {
  const media = [
    { type: 'image', url: exercise.foto_1 },
    { type: 'image', url: exercise.foto_2 },
    { type: 'image', url: exercise.foto_3 },
    { type: 'video', url: exercise.video_url }
  ].filter(item => item.url);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#0f111a]/95 backdrop-blur-xl animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative bg-[#161925] border border-white/10 w-full max-w-lg max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        
        {/* SECCIÓN SUPERIOR: CARRUSEL / MEDIA */}
        <div className="relative h-64 md:h-80 w-full bg-black shrink-0">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-30 bg-black/40 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-purple-600 transition-all shadow-lg"
          >
            <FaTimes size={14} />
          </button>

          <div className="flex overflow-x-auto snap-x snap-mandatory h-full no-scrollbar">
            {media.map((item, i) => (
              <div key={i} className="flex-shrink-0 w-full h-full snap-center relative">
                {item.type === 'image' ? (
                  <img src={item.url} className="w-full h-full object-cover" alt={exercise.nombre} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-purple-900/10">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-4 active:scale-95 transition-all"
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black group-hover:bg-purple-500 group-hover:text-white transition-all shadow-xl">
                        <FaPlay size={20} className="ml-1" />
                      </div>
                      <Text size="xs" weight="black" className="uppercase tracking-widest text-white">Reproducir Técnica</Text>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Indicadores del Carrusel */}
          {media.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {media.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30" />
              ))}
            </div>
          )}
        </div>

        {/* CONTENIDO DEL EJERCICIO */}
        <div className="flex-1 overflow-y-auto p-8 pt-6 no-scrollbar">
          <div className="mb-6">
            <span className="bg-purple-600 text-[8px] px-3 py-1 rounded-md font-black uppercase tracking-widest shadow-lg inline-block">
              {exercise.clase}
            </span>
            <Text size="3xl" weight="black" className="uppercase tracking-tighter italic leading-none mt-3">
              {exercise.nombre}
            </Text>
          </div>

          {/* Descripción estilo blockquote */}
          <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 mb-8">
            <Text size="xs" className="text-gray-400 leading-relaxed italic border-l-2 border-purple-500/50 pl-4">
              {exercise.descripcion || "Enfoque máximo en la técnica para obtener los mejores resultados."}
            </Text>
          </div>

          {/* Arsenal Muscular */}
          <div className="space-y-4 mb-4">
            <Text size="xs" weight="black" className="uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <FaFire className="text-purple-500" size={10} /> Arsenal Muscular
            </Text>
            
            <div className="flex flex-wrap gap-2">
              <div className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-2xl flex items-center gap-3">
                <span className="text-xs font-black text-white uppercase">{exercise.clase}</span>
                <span className="text-[8px] font-black text-purple-400 uppercase bg-purple-500/20 px-2 py-0.5 rounded-md">Principal</span>
              </div>
              
              {/* Secundarios (si existen) */}
              {exercise.musculos_secundarios?.map((m, i) => (
                <div key={i} className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-2xl flex items-center gap-3">
                  <span className="text-xs font-black text-gray-400 uppercase">{m.nombre}</span>
                  <span className={`text-[8px] font-black uppercase ${m.intensidad === 'Medio' ? 'text-orange-400' : 'text-blue-400'} bg-white/5 px-2 py-0.5 rounded-md`}>
                    {m.intensidad}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTÓN FINAL: COMENZAR EJERCICIO */}
        <div className="p-8 bg-white/[0.02] border-t border-white/5">
          <button className="w-full bg-purple-600 text-white py-4 rounded-xl font-black uppercase tracking-[0.15em] text-[10px] hover:bg-purple-500 transition-all shadow-xl shadow-purple-900/20 active:scale-[0.97] flex items-center justify-center gap-2">
            <FaDumbbell size={14} /> Comenzar Ejercicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default EjercicioDetalleModal;