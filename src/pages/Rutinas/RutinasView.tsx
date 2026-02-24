import React, { useEffect, useState, useRef } from "react";
import Text from "../../components/Texts";
import RutinaForm from "./RutinasForm";
import { getRutinas } from "../../services/rutinas";
import { FaChevronLeft, FaChevronRight, FaStar, FaClock, FaDumbbell } from "react-icons/fa";

// --- CAROUSEL INTERNO (Igual al de ejercicios) ---
const Carousel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md p-2.5 rounded-full border border-white/10 hover:bg-purple-600 transition-all shadow-lg">
        <FaChevronLeft size={14} />
      </button>
      <div ref={scrollRef} className="flex overflow-x-auto gap-3 pb-2 no-scrollbar scroll-smooth">
        {children}
      </div>
      <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md p-2.5 rounded-full border border-white/10 hover:bg-purple-600 transition-all shadow-lg">
        <FaChevronRight size={14} />
      </button>
    </div>
  );
};

// --- INTERFACES ---
interface Ejercicio {
  nombre: string;
  series?: number;
  repeticiones?: number;
}

interface Rutina {
  id: number;
  nombre: string;
  descripcion?: string;
  dificultad: string;
  duracion?: number;
  promedio_calificacion?: number;
  ejercicios: Ejercicio[];
}

const dificultades = ["Principiante", "Intermedio", "Avanzado"];

const RutinasView: React.FC<{ goBack: () => void }> = ({ goBack }) => {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [selectedDificultad, setSelectedDificultad] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRutina, setEditingRutina] = useState<any>(null);

  const fetchRutinas = async () => {
    setLoading(true);
    const data = await getRutinas();
    setRutinas(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRutinas();
  }, []);

  const filteredRutinas = selectedDificultad 
    ? rutinas.filter(r => r.dificultad === selectedDificultad)
    : rutinas;

  if (loading) return <div className="min-h-screen bg-[#0f111a] flex items-center justify-center text-white font-black uppercase tracking-widest">Cargando Ares...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#0f111a] text-white font-sans overflow-x-hidden">
      
      {/* HEADER (Diseño Ejercicios) */}
      <header className="sticky top-0 z-50 bg-[#0f111a]/95 backdrop-blur-xl border-b border-white/5 p-4 md:p-6">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <button onClick={goBack} className="group flex items-center gap-3 hover:opacity-80 transition-all active:scale-95 w-fit">
            <FaChevronLeft className="text-purple-500 text-xl md:text-2xl group-hover:-translate-x-1 transition-transform" />
            <div className="flex flex-col items-start">
              <Text size="2xl" weight="black" variant="gradient" className="uppercase tracking-tighter leading-none">FITAPP</Text>
              <Text size="xs" className="text-gray-500 font-bold tracking-widest uppercase">
                {selectedDificultad ? selectedDificultad : "Rutinas"}
              </Text>
            </div>
          </button>

          <Carousel>
            <button
              onClick={() => setSelectedDificultad(null)}
              className={`flex-shrink-0 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                selectedDificultad === null ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/30" : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
              }`}
            > Todos </button>
            {dificultades.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDificultad(d)}
                className={`flex-shrink-0 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                  selectedDificultad === d ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/30" : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                }`}
              > {d} </button>
            ))}
          </Carousel>
        </div>
      </header>

      {showForm && (
        <RutinaForm
          rutina={editingRutina}
          onClose={() => {
            setShowForm(false);
            setEditingRutina(null);
            fetchRutinas();
          }}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1400px] mx-auto w-full pb-24">
        <div className="flex justify-between items-center mb-8">
          <Text size="2xl" weight="black" variant="gradient">
            MIS RUTINAS
          </Text>

          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/30"
          >
            + Nueva Rutina
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRutinas.map((rutina) => (
            <div key={rutina.id} className="group bg-[#161925] rounded-[1.5rem] border border-white/5 overflow-hidden hover:border-purple-500/50 transition-all duration-300 flex flex-col shadow-xl h-[420px]">
              
              <div className="p-6 flex flex-col h-full">
                {/* Badge Dificultad y Rating */}
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/30">
                    {rutina.dificultad}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-lg">
                    <FaStar size={10} />
                    <span className="text-xs font-black">{rutina.promedio_calificacion || "0.0"}</span>
                  </div>
                </div>

                <Text size="xl" weight="black" className="uppercase tracking-tight mb-2 group-hover:text-purple-400 transition-colors truncate">
                  {rutina.nombre}
                </Text>

                <p className="text-gray-500 text-xs leading-tight mb-4 line-clamp-2">
                  {rutina.descripcion}
                </p>

                {/* Lista de ejercicios con scroll interno */}
                <div className="flex-1 overflow-y-auto no-scrollbar bg-black/20 rounded-xl p-3 border border-white/5 mb-4">
                  <div className="text-[9px] text-gray-500 font-bold uppercase mb-2 flex items-center gap-2">
                    <FaDumbbell className="text-purple-500" /> Plan de entrenamiento
                  </div>
                  {rutina.ejercicios.map((ej, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] py-2 border-b border-white/5 last:border-0">
                      <span className="text-gray-300 font-medium truncate pr-2">{ej.nombre}</span>
                      <span className="text-purple-400 font-black shrink-0">{ej.series}x{ej.repeticiones}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Tarjeta */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400 font-bold">
                    <FaClock size={12} className="text-purple-500" />
                    <span className="text-[11px] uppercase tracking-wider">{rutina.duracion || "45"} MIN</span>
                  </div>
                  <button className="bg-white text-black px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-md active:scale-95">
                    Empezar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-20 lg:h-60 w-full" />
      </main>
    </div>
  );
};

export default RutinasView;