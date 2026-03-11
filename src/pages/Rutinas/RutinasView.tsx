import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaStar, FaClock, 
  FaDumbbell, FaGlobeAmericas, FaLock, FaEdit, FaTrash, FaPlus 
} from "react-icons/fa";

// --- COMPONENTES ---
import Text from "../../components/Texts";
import Button from "../../components/Buttons";
import CardLayout from "../../components/CardLayout";
import NotificationModal from "../../components/NotificationModal";
import RutinaForm from "./modales/RutinasForm";
import RutinaDetalle from "./modales/RutinaInfo"; 
import ViewHeader from "../../components/Header"

// --- SERVICIOS ---
import { getRutinas, deleteRutina } from "../../services/rutinas";
import type { NotificationType } from "../../components/NotificationModal";

const categoriasFiltro = ["Mías", "Públicas", "Alta", "Media", "Baja"];

interface Ejercicio {
  id: number;
  nombre: string;
  series?: number;
  repeticiones?: number;
  pivot?: { series: number; repeticiones: number; descanso: number; };
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

interface RutinasViewProps {
  onStartWorkout: (rutina: Rutina) => void;
}

const RutinasView: React.FC<RutinasViewProps> = ({ onStartWorkout }) => {
  const location = useLocation();
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroActivo, setFiltroActivo] = useState<string | null>(null);
  const [filtrosDinamicos, setFiltrosDinamicos] = useState(categoriasFiltro);

  const [showForm, setShowForm] = useState(false);
  const [editingRutina, setEditingRutina] = useState<Rutina | null>(null);
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
    try {
      const data = await getRutinas();
      setRutinas(data);
    } catch (error) {
      console.error("Error al traer rutinas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchRutinas(); 
  }, []);

  useEffect(() => {
    if (location.state?.filtroCategoria) {
      const cat = location.state.filtroCategoria;
      
      if (!filtrosDinamicos.includes(cat)) {
        setFiltrosDinamicos([cat, ...categoriasFiltro]);
      }
      
      setFiltroActivo(cat);
      setSearchTerm(""); 

      window.history.replaceState({}, document.title);
    }
  }, [location, filtrosDinamicos]);

  const filteredRutinas = rutinas.filter((r) => {
    const nombre = r.nombre?.toLowerCase() || "";
    const descripcion = r.descripcion?.toLowerCase() || "";
    const busqueda = searchTerm.toLowerCase();
    const matchesSearch = nombre.includes(busqueda) || descripcion.includes(busqueda);

    let matchesCategory = true;
    if (filtroActivo) {
      if (filtroActivo === "Mías") matchesCategory = !!r.es_mia;
      else if (filtroActivo === "Públicas") matchesCategory = !!r.es_publica;
      else if (["Alta", "Media", "Baja"].includes(filtroActivo)) {
        matchesCategory = r.dificultad?.toLowerCase() === filtroActivo.toLowerCase();
      } else {
        const matchesClase = r.nombre?.toLowerCase().includes(filtroActivo.toLowerCase()) || 
                            r.descripcion?.toLowerCase().includes(filtroActivo.toLowerCase()) ||
                            r.ejercicios?.some(ej => ej.nombre.toLowerCase().includes(filtroActivo.toLowerCase()));
        matchesCategory = matchesClase;
      }
    }
    return matchesSearch && matchesCategory;
  });

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

  if (loading) return (
    <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      <Text size="xs" weight="black" className="uppercase tracking-[0.3em] text-gray-400">Sincronizando Arsenal...</Text>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0f111a]">
      <ViewHeader 
        title="ARES"
        subtitle={`Rutinas / ${filtroActivo || "Todas"}`}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por nombre o descripción..."
        activeFilter={filtroActivo}
        filters={filtrosDinamicos}
        onFilterClick={setFiltroActivo}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full pb-32">
        <div className="flex justify-between items-end mb-10">
          <div>
            <Text size="3xl" weight="black" className="uppercase leading-none italic tracking-tighter">BIBLIOTECA</Text>
            <Text size="xs" className="text-gray-500 font-bold uppercase tracking-widest mt-2">
              {filteredRutinas.length} Planes de entrenamiento listos
            </Text>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => { setEditingRutina(null); setShowForm(true); }}
            className="flex items-center gap-2 !px-6 shadow-lg shadow-purple-500/20"
          >
            <FaPlus /> CREAR RUTINA
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRutinas.map((rutina) => (
            <CardLayout
              key={rutina.id}
              onClick={() => setSelectedRutinaInfo(rutina)}
              className="h-[460px] relative group border border-white/5 hover:border-purple-500/30 transition-all duration-500 cursor-pointer !p-0 overflow-hidden"
            >
              {rutina.es_mia && (
                <div className="absolute top-4 right-0 z-30 flex flex-col gap-2 transition-transform duration-300 translate-x-0 lg:translate-x-12 lg:group-hover:translate-x-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditingRutina(rutina); setShowForm(true); }} 
                    className="p-3 bg-white text-black rounded-l-xl hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-90"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteRequest(rutina); }} 
                    className="p-3 bg-white text-red-600 rounded-l-xl hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-90"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              )}

              <div className="p-6 flex flex-col h-full bg-[#161925]">
                {/* BADGES */}
                <div className="flex justify-between items-start mb-4 pr-6">
                  <div className="flex gap-2">
                    <span className="bg-purple-600/10 text-purple-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase border border-purple-500/20">
                      {rutina.dificultad}
                    </span>
                    <span className={`p-1.5 rounded-lg border ${rutina.es_publica ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}>
                      {rutina.es_publica ? <FaGlobeAmericas size={10} /> : <FaLock size={10} />}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg border border-yellow-500/20">
                    <FaStar size={10} />
                    <Text size="xs" weight="black">{Number(rutina.promedio_calificacion).toFixed(1) || "0.0"}</Text>
                  </div>
                </div>

                {/* INFO */}
                <div className="mb-4">
                  <Text size="xl" weight="black" className="uppercase tracking-tight group-hover:text-purple-400 transition-colors truncate italic">
                    {rutina.nombre}
                  </Text>
                  <Text size="xs" className="text-gray-500 line-clamp-2 mt-1 leading-relaxed italic">
                    {rutina.descripcion || "Sin descripción disponible."}
                  </Text>
                </div>

                {/* LISTA DE EJERCICIOS */}
                <div className="flex-1 overflow-y-auto no-scrollbar bg-black/40 rounded-[1.5rem] p-4 border border-white/5 mb-6">
                  <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                    <Text size="xs" weight="black" className="text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <FaDumbbell className="text-purple-500" size={10} /> PLAN DE ATAQUE
                    </Text>
                    <Text size="xs" weight="black" className="text-purple-400">{rutina.ejercicios?.length || 0} EJS</Text>
                  </div>
                  <div className="space-y-2">
                    {rutina.ejercicios?.map((ej, idx) => (
                      <div key={idx} className="flex justify-between items-center group/ej">
                        <Text size="xs" className="text-gray-400 group-hover/ej:text-white transition-colors truncate pr-2 lowercase italic first-letter:uppercase">
                          {ej.nombre}
                        </Text>
                        <Text size="xs" weight="black" className="text-purple-400/80 whitespace-nowrap italic">
                          {ej.pivot ? `${ej.pivot.series}x${ej.pivot.repeticiones}` : `${ej.series || 0}x${ej.repeticiones || 0}`}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER CARD */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FaClock size={12} className="text-purple-500" />
                    <Text size="xs" weight="black" className="uppercase italic">{rutina.duracion || "45"} MIN</Text>
                  </div>
                  <Text 
                    size="xs" 
                    weight="black" 
                    variant="gradient" 
                    className="uppercase italic tracking-widest transition-opacity opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                  >
                    Ver Detalles
                  </Text>
                </div>
              </div>
            </CardLayout>
          ))}
        </div>
      </main>

      {/* MODALES */}
      {showForm && (
        <RutinaForm 
          rutina={editingRutina} 
          onClose={() => { setShowForm(false); setEditingRutina(null); }} 
          onSuccess={() => { fetchRutinas(); setShowForm(false); }} 
        />
      )}
      
      {selectedRutinaInfo && (
        <RutinaDetalle 
          rutina={selectedRutinaInfo} 
          onClose={() => setSelectedRutinaInfo(null)} 
          onStart={onStartWorkout}
        />
      )}
      
      <NotificationModal {...noti} onClose={closeNoti} />
    </div>
  );
};

export default RutinasView;