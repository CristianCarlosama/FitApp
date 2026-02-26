import React, { useEffect, useState, useRef } from "react";
import Text from "../../components/Texts";
import SearchInput from "../../components/SearchInput";
import RutinaForm from "./modales/RutinasForm";
import RutinaDetalle from "./modales/RutinaInfo"; 
import NotificationModal from "../../components/NotificationModal";
import type { NotificationType } from "../../components/NotificationModal";
import { getRutinas, deleteRutina } from "../../services/rutinas";
import { 
  FaChevronLeft, FaChevronRight, FaStar, FaClock, 
  FaDumbbell, FaGlobeAmericas, FaLock, FaEdit, FaTrash 
} from "react-icons/fa";

// --- CATEGORÍAS ---
const categoriasFiltro = ["Mías", "Públicas", "Pecho", "Pierna", "Espalda", "Hombros", "Brazos", "Abdomen"];

// --- CAROUSEL REUTILIZABLE ---
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
  es_mia?: boolean;
  es_publica?: boolean;
}

const RutinasView: React.FC<{ goBack: () => void }> = ({ goBack }) => {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroActivo, setFiltroActivo] = useState<string | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [editingRutina, setEditingRutina] = useState<any>(null);
  const [selectedRutinaInfo, setSelectedRutinaInfo] = useState<Rutina | null>(null);

  const [noti, setNoti] = useState<{
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, type: "info", title: "", message: "" });

  const closeNoti = () => setNoti(prev => ({ ...prev, isOpen: false }));

  const fetchRutinas = async () => {
    setLoading(true);
    const data = await getRutinas();
    setRutinas(data);
    setLoading(false);
  };

  useEffect(() => { fetchRutinas(); }, []);

  const handleDeleteRequest = (rutina: Rutina) => {
    setNoti({
      isOpen: true,
      type: "delete",
      title: "¿Eliminar Rutina?",
      message: `Vas a borrar "${rutina.nombre}". Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        await deleteRutina(rutina.id);
        fetchRutinas();
        closeNoti();
      }
    });
  };

  const getRutinasFinales = () => {
    let result = [...rutinas];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r => 
        r.nombre.toLowerCase().includes(term) || 
        r.descripcion?.toLowerCase().includes(term)
      );
    }
    if (filtroActivo) {
      if (filtroActivo === "Mías") result = result.filter(r => r.es_mia);
      else if (filtroActivo === "Públicas") result = result.filter(r => r.es_publica);
      else {
        result = result.filter(r => 
          r.ejercicios.some(ej => ej.nombre.toLowerCase().includes(filtroActivo.toLowerCase()))
        );
      }
    }
    return result;
  };

  const rutinasFinales = getRutinasFinales();

  if (loading) return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center text-white font-black uppercase tracking-widest">
      Cargando Ares...
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#0f111a] text-white font-sans overflow-x-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0f111a]/95 backdrop-blur-xl border-b border-white/5 p-4 md:p-6">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <button onClick={goBack} className="group flex items-center gap-3 active:scale-95 transition-all w-fit">
              <FaChevronLeft className="text-purple-500" />
              <div className="flex flex-col items-start">
                <Text size="2xl" weight="black" variant="gradient" className="uppercase tracking-tighter leading-none">FITAPP</Text>
                <Text size="xs" className="text-gray-500 font-bold tracking-widest uppercase">{filtroActivo || "Rutinas"}</Text>
              </div>
            </button>
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por nombre o músculo..." />
          </div>

          <Carousel>
            <button onClick={() => setFiltroActivo(null)} className={`flex-shrink-0 px-6 py-2 rounded-full text-[10px] font-black uppercase border transition-all ${filtroActivo === null ? "bg-purple-600 border-purple-600 shadow-lg shadow-purple-500/30" : "bg-white/5 border-white/10 text-gray-400"}`}>Todos</button>
            {categoriasFiltro.map(c => (
              <button key={c} onClick={() => setFiltroActivo(c)} className={`flex-shrink-0 px-6 py-2 rounded-full text-[10px] font-black uppercase border transition-all ${filtroActivo === c ? "bg-purple-600 border-purple-600 shadow-lg shadow-purple-500/30" : "bg-white/5 border-white/10 text-gray-400"}`}>{c}</button>
            ))}
          </Carousel>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full pb-24">
        <div className="flex justify-between items-center mb-8">
          <Text size="2xl" weight="black" variant="gradient">MIS RUTINAS</Text>
          <button onClick={() => { setEditingRutina(null); setShowForm(true); }} className="bg-purple-600 hover:bg-purple-700 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">+ Nueva Rutina</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {rutinasFinales.map((rutina) => (
            <div
              key={rutina.id}
              onClick={() => setSelectedRutinaInfo(rutina)}
              className="group relative bg-[#161925] rounded-[2rem] border border-white/5 overflow-hidden hover:border-purple-500/50 transition-all duration-300 flex flex-col shadow-xl h-[420px] cursor-pointer"
            >
              {/* PANEL DE BOTONES (Efecto Pestaña asomada) */}
              {rutina.es_mia && (
                <div className="absolute top-6 right-0 z-30 flex flex-col gap-2 
                                translate-x-9 group-hover:translate-x-[-12px] 
                                transition-transform duration-300 ease-out">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditingRutina(rutina); setShowForm(true); }}
                    className="p-3 bg-white text-black rounded-l-xl hover:bg-purple-600 hover:text-white transition-all shadow-2xl active:scale-90"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteRequest(rutina); }}
                    className="p-3 bg-white text-red-600 rounded-l-xl hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-90"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              )}

              <div className="p-5 md:p-6 flex flex-col h-full">
                {/* Contenido de la tarjeta (Badges, Título, etc.) */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded-full text-[8px] font-black uppercase border border-purple-500/30">
                      {rutina.dificultad}
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-black border ${rutina.es_publica ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                      {rutina.es_publica ? <FaGlobeAmericas size={10} /> : <FaLock size={10} />}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-lg">
                    <FaStar size={10} />
                    <span className="text-[10px] font-black">{rutina.promedio_calificacion || "0.0"}</span>
                  </div>
                </div>

                {/* Título y Descripción con padding derecho para no chocar con la pestaña */}
                <div className="pr-4">
                  <Text size="lg" weight="black" className="uppercase tracking-tight mb-1 group-hover:text-purple-400 transition-colors truncate">
                    {rutina.nombre}
                  </Text>
                  <p className="text-gray-500 text-[10px] leading-tight mb-4 line-clamp-2">{rutina.descripcion}</p>
                </div>

                {/* Lista de Ejercicios */}
                <div className="flex-1 overflow-y-auto no-scrollbar bg-black/20 rounded-2xl p-4 border border-white/5 mb-4">
                  <div className="text-[9px] text-gray-500 font-bold uppercase mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2"><FaDumbbell className="text-purple-500" /> Plan</span>
                    <span className="text-purple-400">{rutina.ejercicios.length} Ejs</span>
                  </div>
                  {rutina.ejercicios.map((ej, idx) => (
                    <div key={idx} className="flex justify-between text-[10px] py-2 border-b border-white/5 last:border-0">
                      <span className="text-gray-300 truncate pr-2">{ej.nombre}</span>
                      <span className="text-purple-400 font-black">{ej.series}x{ej.repeticiones}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center gap-2 text-gray-400 font-bold">
                  <FaClock size={12} className="text-purple-500" />
                  <span className="text-[10px] uppercase tracking-wider">{rutina.duracion || "45"} MIN</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showForm && <RutinaForm rutina={editingRutina} onClose={() => { setShowForm(false); setEditingRutina(null); }} onSuccess={fetchRutinas} />}
      {selectedRutinaInfo && <RutinaDetalle rutina={selectedRutinaInfo} onClose={() => setSelectedRutinaInfo(null)} />}
      <NotificationModal {...noti} onClose={closeNoti} />
    </div>
  );
};

export default RutinasView;