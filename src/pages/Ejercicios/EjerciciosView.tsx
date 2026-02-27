import React, { useEffect, useState, useRef } from "react";
import { getEjercicios } from "../../services/ejercicios";
import SearchInput from "../../components/SearchInput";
import Text from "../../components/Texts";
import CardLayout from "../../components/CardLayout";
import { FaDumbbell, FaChevronLeft, FaFire, FaSearch } from "react-icons/fa";
import EjercicioDetalleModal from "./modales/EjercicioDetalle";

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
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md p-2.5 rounded-full flex items-center justify-center border border-white/10 hover:bg-purple-600 transition-all shadow-lg"
      >
        <FaChevronLeft size={14} className="text-white" />
      </button>

      <div ref={scrollRef} className={`flex overflow-x-auto gap-3 pb-2 no-scrollbar scroll-smooth ${className}`}>
        {children}
      </div>

      <button 
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md p-2.5 rounded-full flex items-center justify-center border border-white/10 hover:bg-purple-600 transition-all shadow-lg"
      >
        <FaChevronLeft size={14} className="text-white rotate-180" />
      </button>
    </div>
  );
};

// --- INTERFACES ---
export interface MusculoImpacto {
  nombre: string;
  intensidad: "Alto" | "Medio" | "Bajo";
}

export interface Ejercicio {
  id: number;
  nombre: string;
  clase: string; 
  musculos_secundarios?: MusculoImpacto[]; 
  descripcion?: string;
  video_url?: string;
  foto_1?: string;
  foto_2?: string;
  foto_3?: string;
}

const clases = ["Piernas", "Pecho", "Espalda", "Hombros", "Brazos", "Pantorrilla", "Abdomen"];

const EjerciciosView: React.FC<{ goBack: () => void }> = ({ goBack }) => {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClase, setSelectedClase] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Ejercicio | null>(null);

  useEffect(() => {
    fetchEjercicios();
  }, []);

  const fetchEjercicios = async () => {
    setLoading(true);
    const data = await getEjercicios();
    setEjercicios(data);
    setLoading(false);
  };

  const filteredEjercicios = ejercicios.filter((e) => {
    const nombre = e.nombre?.toLowerCase() || "";
    const descripcion = e.descripcion?.toLowerCase() || "";
    const busqueda = searchTerm.toLowerCase();
    
    const matchesSearch = nombre.includes(busqueda) || descripcion.includes(busqueda);

    // Filtrado por Categoría
    let matchesCategory = true;
    if (selectedClase) {
      const claseNormalizada = selectedClase.trim().toLowerCase();
      const esPrincipal = (e.clase || "").trim().toLowerCase() === claseNormalizada;
      const esSecundario = !!e.musculos_secundarios?.some(
        m => (m.nombre || "").trim().toLowerCase() === claseNormalizada
      );
      matchesCategory = esPrincipal || esSecundario;
    }
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center text-white font-black uppercase tracking-widest">
      Cargando Ejercicios...
    </div>
  );

  return (
    <div className="flex flex-col h-auto w-full font-sans">
      
      <header className="sticky top-0 z-50 bg-[#0f111a]/95 backdrop-blur-xl border-b border-white/5 p-4 md:p-6">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <button onClick={goBack} className="group flex items-center gap-3 active:scale-95 transition-all w-fit">
              <FaChevronLeft className="text-purple-500 text-xl" />
              <div className="flex flex-col items-start">
                <Text size="2xl" weight="black" variant="gradient" className="uppercase tracking-tighter leading-none">FITAPP</Text>
                <Text size="xs" className="text-gray-500 font-bold tracking-widest uppercase">Ejercicios / {selectedClase}</Text>
              </div>
            </button>

            <SearchInput 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Buscar ejercicio..." 
            />
          </div>

          <Carousel>
            <button
              onClick={() => setSelectedClase(null)}
              className={`flex-shrink-0 px-6 py-2 rounded-full text-[10px] font-black uppercase border transition-all ${selectedClase === null ? "bg-purple-600 border-purple-600 shadow-lg shadow-purple-500/30" : "bg-white/5 border-white/10 text-gray-400"}`}
            >
              Todos 
            </button>
            {clases.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClase(c)}
                className={`flex-shrink-0 px-6 py-2 rounded-full text-[10px] font-black uppercase border transition-all ${selectedClase === c ? "bg-purple-600 border-purple-600 shadow-lg shadow-purple-500/30" : "bg-white/5 border-white/10 text-gray-400"}`}
              >
                {c}
              </button>
            ))}
          </Carousel>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-[1400px] mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
            <div className="flex flex-col">
              <Text size="2xl" weight="black" variant="gradient" className="uppercase">Ejercicios</Text>
              <Text size="xs" className="text-gray-500 font-bold uppercase tracking-widest">
                {filteredEjercicios.length} resultados encontrados
              </Text>
            </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredEjercicios.length > 0 ? (
            filteredEjercicios.map((e) => (
              <CardLayout 
                key={e.id} 
                onClick={() => setSelectedExercise(e)} 
                className="h-[420px]"
              >
                <div className="relative h-40 bg-gray-900 overflow-hidden shrink-0">
                  {e.foto_1 ? (
                    <img 
                      src={`${import.meta.env.VITE_STORAGE_URL}/${e.foto_1}`} 
                      alt={e.nombre} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/10 to-black">
                      <FaDumbbell className="text-white/5 text-5xl" />
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                      {e.clase}
                    </span>
                  </div>
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <Text size="lg" weight="black" className="uppercase tracking-tight mb-1 group-hover:text-purple-400 transition-colors truncate">
                    {e.nombre}
                  </Text>
                  <p className="text-gray-500 text-[10px] leading-tight mb-4 line-clamp-2">
                      {e.descripcion || "Sin descripción disponible para este ejercicio."}
                  </p>

                  <div className="flex-1 overflow-y-auto no-scrollbar bg-black/20 rounded-2xl p-4 border border-white/5 mb-4">
                    <div className="text-[9px] text-gray-500 font-bold uppercase mb-2 flex items-center gap-2">
                      <FaFire className="text-purple-500" /> Grupos Musculares
                    </div>
                    
                    <div className="flex justify-between text-[10px] py-2 border-b border-white/5">
                      <span className="text-gray-300 uppercase">{e.clase}</span>
                      <span className="text-purple-400 font-black italic">ALTO</span>
                    </div>

                    {e.musculos_secundarios?.map((sec, idx) => (
                      <div key={idx} className="flex justify-between text-[10px] py-2 border-b border-white/5 last:border-0">
                        <span className="text-gray-400 uppercase">{sec.nombre}</span>
                        <span className={`font-black ${sec.intensidad === 'Medio' ? 'text-orange-400' : 'text-blue-400'}`}>
                          {sec.intensidad.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                      <div className="flex -space-x-2">
                          {[e.foto_1, e.foto_2, e.foto_3].map((f, i) => f && (
                              <img key={i} src={f} className="w-7 h-7 rounded-full border-2 border-[#161925] object-cover" alt="prev" />
                          ))}
                      </div>
                  </div>
                </div>
              </CardLayout>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
              <FaSearch size={40} className="text-gray-600 mb-4" />
              <Text weight="black" className="uppercase tracking-widest text-gray-500">No se encontraron ejercicios</Text>
              <button onClick={() => {setSearchTerm(""); setSelectedClase(null)}} className="mt-4 text-purple-500 font-bold text-xs hover:underline">Limpiar filtros</button>
            </div>
          )}
        </div>
      </main>

      {selectedExercise && (
        <EjercicioDetalleModal 
          exercise={selectedExercise} 
          onClose={() => setSelectedExercise(null)} 
        />
      )}
    </div>
  );
};

export default EjerciciosView;