import React, { useEffect, useState, useRef } from "react";
import { getEjercicios } from "../../services/ejercicios";
import Text from "../../components/Texts";
import { FaDumbbell, FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// --- COMPONENTE CAROUSEL REUTILIZABLE ---
const Carousel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full px-10">
      <button 
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md p-2.5 rounded-full flex items-center justify-center border border-white/10 hover:bg-purple-600 hover:border-purple-500 transition-all shadow-lg shadow-black/20"
      >
        <FaChevronLeft size={14} className="text-white" />
      </button>

      <div 
        ref={scrollRef}
        className={`flex overflow-x-auto gap-3 pb-2 no-scrollbar scroll-smooth ${className}`}
      >
        {children}
      </div>

      <button 
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md p-2.5 rounded-full flex items-center justify-center border border-white/10 hover:bg-purple-600 hover:border-purple-500 transition-all shadow-lg shadow-black/20"
      >
        <FaChevronRight size={14} className="text-white" />
      </button>
    </div>
  );
};

interface Ejercicio {
  id: number;
  nombre: string;
  clase: string;
  descripcion?: string;
  series?: number | null;
  repeticiones?: number | null;
  descanso?: number | null;
  video_url?: string;
  foto_1?: string;
  foto_2?: string;
  foto_3?: string;
}

const clases = ["Piernas", "Pecho", "Espalda", "Hombros", "Brazos", "Pantorrilla", "Abdomen"];


interface EjerciciosViewProps {
  goBack: () => void;
}

const EjerciciosView: React.FC<EjerciciosViewProps> = ({ goBack }) => {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [selectedClase, setSelectedClase] = useState<string | null>(null);

  useEffect(() => {
    fetchEjercicios();
  }, []);

  const fetchEjercicios = async () => {
    const data = await getEjercicios();
    setEjercicios(data);
  };

  const filteredEjercicios = selectedClase
    ? ejercicios.filter((e) => {
        // Si el campo clase no existe, no lo muestra
        if (!e.clase) return false;
        
        // Limpiamos espacios y pasamos a minúsculas para comparar exacto
        return e.clase.trim().toLowerCase() === selectedClase.trim().toLowerCase();
      })
    : ejercicios;

  return (
    <div className="flex flex-col min-h-screen bg-[#0f111a] text-white font-sans overflow-x-hidden">
      
      <header className="sticky top-0 z-50 bg-[#0f111a]/95 backdrop-blur-xl border-b border-white/5 p-4 md:p-6">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          
          {/* TÍTULO QUE FUNCIONA COMO BOTÓN VOLVER */}
          <div className="flex items-center gap-3">
            <button 
              onClick={goBack}
              className="group flex items-center gap-3 hover:opacity-80 transition-all active:scale-95"
            >
              <FaChevronLeft className="text-purple-500 text-xl md:text-2xl group-hover:-translate-x-1 transition-transform" />
              
              <div className="flex flex-col items-start">
                <Text size="2xl" weight="black" variant="gradient" className="uppercase tracking-tighter leading-none">
                  FITAPP
                </Text>
                <Text size="xs" className="text-gray-500 font-bold tracking-widest uppercase">
                  {selectedClase ? selectedClase : "Biblioteca"}
                </Text>
              </div>
            </button>
          </div>

          {/* Carrusel de Categorías */}
          <Carousel>
            <button
              onClick={() => setSelectedClase(null)}
              className={`flex-shrink-0 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                selectedClase === null 
                ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/30" 
                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              Todos 
            </button>
            {clases.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClase(c)}
                className={`flex-shrink-0 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                  selectedClase === c 
                  ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/30" 
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                {c}
              </button>
            ))}
          </Carousel>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1400px] mx-auto w-full pb-24">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {filteredEjercicios.map((e) => (
            <div 
              key={e.id} 
              className="group bg-[#161925] rounded-[1.5rem] md:rounded-[2rem] border border-white/5 overflow-hidden hover:border-purple-500/50 transition-all duration-300 flex flex-col shadow-xl h-[380px] md:h-[460px]" // Altura fija definida aquí
            >
              <div className="relative h-32 sm:h-48 md:h-52 lg:h-56 bg-gray-900 overflow-hidden shrink-0">
                {e.foto_1 ? (
                  <img src={e.foto_1} alt={e.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/10 to-black">
                    <FaDumbbell className="text-white/5 text-4xl md:text-6xl" />
                  </div>
                )}
                <div className="absolute top-2 left-2 md:top-4 md:left-4">
                  <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-[7px] md:text-[10px] font-black uppercase tracking-widest">
                    {e.clase}
                  </span>
                </div>
              </div>

              <div className="p-4 md:p-6 flex flex-col flex-1 min-h-0">
                <Text size="lg" weight="black" className="mb-1 md:mb-2 uppercase tracking-tight group-hover:text-purple-400 transition-colors leading-none md:text-2xl truncate shrink-0">
                  {e.nombre}
                </Text>
                
                {/* Contenedor de descripción con scroll interno si el texto es muy largo */}
                <div className="flex-1 overflow-y-auto no-scrollbar mb-3">
                  {e.descripcion && (
                    <p className="text-gray-500 text-[9px] md:text-xs leading-tight">
                      {e.descripcion}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-auto shrink-0">
                  <div className="bg-white/5 py-1.5 md:py-2.5 rounded-xl border border-white/5 text-center">
                    <span className="block text-[7px] md:text-[9px] text-gray-500 font-bold uppercase">Series</span>
                    <span className="text-xs md:text-base font-black">{e.series || "--"}</span>
                  </div>
                  <div className="bg-white/5 py-1.5 md:py-2.5 rounded-xl border border-white/5 text-center">
                    <span className="block text-[7px] md:text-[9px] text-gray-500 font-bold uppercase">Reps</span>
                    <span className="text-xs md:text-base font-black">{e.repeticiones || "--"}</span>
                  </div>
                  <div className="bg-white/5 py-2 md:py-2.5 rounded-xl border border-white/5 text-center">
                    <span className="block text-[7px] md:text-[9px] text-gray-500 font-bold uppercase">Rest</span>
                    <span className="text-xs md:text-base font-black">{e.descanso ? `${e.descanso}s` : "--"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/5 shrink-0">
                  <div className="flex -space-x-2 md:-space-x-3">
                    {[e.foto_1, e.foto_2, e.foto_3].map((f, i) => f && (
                      <img key={i} src={f} className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-[#161925] object-cover" alt="prev" />
                    ))}
                  </div>

                  {e.video_url && (
                    <a
                      href={e.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 md:gap-2 bg-white text-black px-3 py-1.5 md:px-5 md:py-2 rounded-lg text-[9px] md:text-xs font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-md"
                    >
                      <FaPlay size={8} /> <span>Video</span>
                    </a>
                  )}
                </div>
                
              </div>
            </div>
          ))}
        </div>
        <div className="h-2 lg:h-20 w-full" />
      </main>
    </div>
  );
};

export default EjerciciosView;