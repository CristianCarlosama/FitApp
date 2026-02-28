import { useState, useRef } from "react";
import Text from "../../../components/Texts";
import { 
  FaTimes, 
  FaDumbbell, 
  FaFire, 
  FaChevronRight, 
  FaChevronLeft, 
  FaPlay 
} from "react-icons/fa";

// --- SUB-MODAL DE INFORMACIÓN DEL EJERCICIO ---
const EjercicioInfoModal = ({ exercise, onClose }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. FUNCIÓN DE URL CORREGIDA
  const getImageUrl = (url: string | null) => {
    if (!url || url === "null" || url === "undefined") return "";
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_STORAGE_URL;
    return `${baseUrl}/${url}`.replace(/([^:]\/)\/+/g, "$1"); 
  };

  // 2. CONSTRUCCIÓN DEL ARRAY DE MEDIOS
  const media = [
    { type: 'image', url: getImageUrl(exercise.foto_1) },
    { type: 'image', url: getImageUrl(exercise.foto_2) },
    { type: 'image', url: getImageUrl(exercise.foto_3) },
    { type: 'video', url: exercise.video_url }
  ].filter(item => item.url && item.url.length > 5);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setActiveIndex(index);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 lg:left-72 xl:right-80 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#161925] border border-white/10 w-full max-w-sm rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* ÁREA DE CARRUSEL */}
        <div className="relative h-60 w-full bg-black shrink-0 group">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 bg-black/60 p-2 rounded-full text-white hover:bg-purple-600 transition-all shadow-lg"
          >
            <FaTimes size={12} />
          </button>

          {media.length > 1 && (
            <>
              <button 
                onClick={() => scroll('left')} 
                className="absolute left-3 top-1/2 -translate-y-1/2 z-40 bg-black/50 p-2.5 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
              >
                <FaChevronLeft size={12} />
              </button>
              <button 
                onClick={() => scroll('right')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 z-40 bg-black/50 p-2.5 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
              >
                <FaChevronRight size={12} />
              </button>
            </>
          )}

          <div 
            ref={scrollRef} 
            onScroll={handleScroll} 
            className="flex overflow-x-auto snap-x snap-mandatory h-full no-scrollbar scroll-smooth"
          >
            {media.length > 0 ? (
              media.map((item, i) => (
                <div key={i} className="flex-shrink-0 w-full h-full snap-center relative">
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
                    <div className="w-full h-full flex flex-col items-center justify-center bg-purple-500/10 border-b border-purple-500/20">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 group/play">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover/play:scale-110 transition-transform">
                          <FaPlay size={18} className="ml-1" />
                        </div>
                        <Text size="xs" weight="black" className="uppercase text-white tracking-[0.2em] text-[9px]">Ver Técnica</Text>
                      </a>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <Text size="xs" className="text-gray-500">Sin multimedia disponible</Text>
              </div>
            )}
          </div>

          {media.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-40 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
              {media.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-purple-500 w-4" : "bg-white/20"}`} 
                />
              ))}
            </div>
          )}
        </div>

        {/* CONTENIDO TEXTUAL */}
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
              {/* FUNCIÓN AÑADIDA: Prioriza el descanso del pivot de la rutina */}
              <span className="text-xs font-black uppercase text-white">{exercise.pivot?.descanso || exercise.descanso || "60"}S</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODAL PRINCIPAL ---
const RutinaDetalle = ({ rutina, onClose }: any) => {
  const [selectedEx, setSelectedEx] = useState<any>(null);
  const diffColor = rutina.dificultad === 'alta' ? 'bg-red-500' : rutina.dificultad === 'media' ? 'bg-orange-500' : 'bg-green-500';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:left-72 xl:right-80 transition-all duration-300">
      <div className="absolute inset-0 bg-[#0f111a]/95 backdrop-blur-xl" onClick={onClose} />
      <div className="relative bg-[#161925] border border-white/10 w-full max-w-lg max-h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
        {/* HEADER */}
        <div className="relative h-32 flex-shrink-0 bg-gradient-to-b from-purple-600/20 to-transparent flex items-end px-8 pb-5">
          <button onClick={onClose} className="absolute top-6 right-6 z-20 bg-black/40 p-2.5 rounded-full text-white hover:bg-purple-600 transition-all shadow-lg border border-white/5">
            <FaTimes size={12} />
          </button>
          <div className="w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className={`${diffColor} text-[8px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest shadow-lg text-white`}>
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
        {/* LISTA */}
        <div className="flex-1 overflow-y-auto p-8 pt-2 no-scrollbar">
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
                className="group bg-white/[0.03] hover:bg-purple-600/[0.05] border border-white/5 hover:border-purple-500/30 p-4 rounded-2xl flex justify-between items-center cursor-pointer transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 bg-black/40 rounded-xl flex items-center justify-center font-black text-[11px] text-purple-500 border border-white/5 group-hover:border-purple-500/30">
                    {i + 1}
                  </div>
                  <div>
                    <span className="block text-xs font-black uppercase tracking-tight group-hover:text-purple-400 transition-colors text-white">
                      {ej.nombre}
                    </span>
                    <div className="flex gap-2 mt-1">
                      {/* FUNCIÓN AÑADIDA: Extrae series y reps del pivot de Laravel */}
                      <span className="text-[9px] text-gray-500 font-bold uppercase">
                        {ej.pivot?.series || ej.series || 0} Series
                      </span>
                      <span className="text-[9px] text-purple-900/50">•</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase">
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
        {/* FOOTER */}
        <div className="p-8 bg-black/20 border-t border-white/5">
          <button className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-3">
            <FaFire size={14} /> Comenzar Entrenamiento
          </button>
        </div>
      </div>

      {selectedEx && <EjercicioInfoModal exercise={selectedEx} onClose={() => setSelectedEx(null)} />}
    </div>
  );
};

export default RutinaDetalle;