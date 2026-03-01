import React, { useEffect, useState } from "react";
import Text from "../../components/Texts";
import Button from "../../components/Buttons";
import Carousel from "../../components/Carousel";
import SearchInput from "../../components/SearchInput";
import CardLayout from "../../components/CardLayout";
import NotificationModal from "../../components/NotificationModal";
import RutinaForm from "./modales/RutinasForm";
import RutinaDetalle from "./modales/RutinaInfo"; 

import { getRutinas, deleteRutina } from "../../services/rutinas";
import type { NotificationType } from "../../components/NotificationModal";
import { 
  FaChevronLeft, FaStar, FaClock, 
  FaDumbbell, FaGlobeAmericas, FaLock, FaEdit, FaTrash 
} from "react-icons/fa";

const categoriasFiltro = ["Mías", "Públicas", "Pecho", "Alta", "Media", "Baja"];

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
  goBack: () => void;
  onStartWorkout: (rutina: Rutina) => void;
}

const RutinasView: React.FC<RutinasViewProps> = ({ goBack, onStartWorkout }) => {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroActivo, setFiltroActivo] = useState<string | null>(null);
  
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

  useEffect(() => { fetchRutinas(); }, []);

  const filteredRutinas = rutinas.filter((r) => {
    const nombre = r.nombre?.toLowerCase() || "";
    const descripcion = r.descripcion?.toLowerCase() || "";
    const busqueda = searchTerm.toLowerCase();
    const matchesSearch = nombre.includes(busqueda) || descripcion.includes(busqueda);

    let matchesCategory = true;
    if (filtroActivo) {
      if (filtroActivo === "Mías") matchesCategory = !!r.es_mia;
      else if (filtroActivo === "Públicas") matchesCategory = !!r.es_publica;
      else if (["Alta", "Media", "Baja"].includes(filtroActivo)) matchesCategory = r.dificultad?.toLowerCase() === filtroActivo.toLowerCase();
      else matchesCategory = r.ejercicios?.some(ej => ej.nombre.toLowerCase().includes(filtroActivo.toLowerCase()));
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
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center">
      <Text size="xl" weight="black" className="uppercase animate-pulse">Cargando Ares...</Text>
    </div>
  );

  return (
    <div className="flex flex-col h-auto w-full font-sans">
      <header className="sticky top-0 z-40 bg-[#0f111a]/95 backdrop-blur-xl border-b border-white/5 p-4 md:p-6">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <button onClick={goBack} className="group flex items-center gap-3 active:scale-95 transition-all w-fit">
              <FaChevronLeft className="text-purple-500" />
              <div className="flex flex-col items-start">
                <Text size="2xl" weight="black" variant="gradient" className="uppercase tracking-tighter leading-none italic">ARES</Text>
                <Text size="xs" className="text-gray-500 font-bold tracking-widest uppercase italic">Rutinas / {filtroActivo || "Explorar"}</Text>
              </div>
            </button>
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por nombre o músculo..." />
          </div>

          <Carousel className="w-full">
            <Button 
              variant={filtroActivo === null ? "primary" : "glass"} 
              size="sm" 
              onClick={() => setFiltroActivo(null)}
              className="flex-shrink-0 !rounded-full !px-8"
            >
              TODOS
            </Button>
            {categoriasFiltro.map(c => (
              <Button 
                key={c}
                variant={filtroActivo === c ? "primary" : "glass"} 
                size="sm" 
                onClick={() => setFiltroActivo(c)}
                className="flex-shrink-0 !rounded-full !px-8"
              >
                {c}
              </Button>
            ))}
          </Carousel>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-[1400px] mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div className="flex flex-col">
            <Text size="3xl" weight="black" variant="gradient" className="uppercase leading-none italic">EXPLORAR</Text>
            <Text size="xs" className="text-gray-500 font-bold uppercase tracking-widest mt-2">
              {filteredRutinas.length} resultados disponibles
            </Text>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => { setEditingRutina(null); setShowForm(true); }}
            className="flex items-center gap-2"
          >
            <FaDumbbell /> NUEVA RUTINA
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRutinas.map((rutina) => (
            <CardLayout
              key={rutina.id}
              onClick={() => setSelectedRutinaInfo(rutina)}
              className="h-[460px] relative group border border-white/5 hover:border-purple-500/30 transition-all duration-500"
            >
              {rutina.es_mia && (
                <div className="absolute top-6 right-0 z-30 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                  <button onClick={(e) => { e.stopPropagation(); setEditingRutina(rutina); setShowForm(true); }} className="p-3 bg-white text-black rounded-l-xl hover:bg-purple-600 hover:text-white transition-all shadow-xl"><FaEdit size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteRequest(rutina); }} className="p-3 bg-white text-red-600 rounded-l-xl hover:bg-red-600 hover:text-white transition-all shadow-xl"><FaTrash size={14} /></button>
                </div>
              )}

              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="bg-purple-600/10 text-purple-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase border border-purple-500/20">{rutina.dificultad}</span>
                    <span className={`p-1.5 rounded-lg border ${rutina.es_publica ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}>
                      {rutina.es_publica ? <FaGlobeAmericas size={10} /> : <FaLock size={10} />}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg border border-yellow-500/20">
                    <FaStar size={10} />
                    <Text size="xs" weight="black">{Number(rutina.promedio_calificacion).toFixed(1) || "0.0"}</Text>
                  </div>
                </div>

                <div className="mb-4">
                  <Text size="xl" weight="black" className="uppercase tracking-tight group-hover:text-purple-400 transition-colors truncate italic">{rutina.nombre}</Text>
                  <Text size="xs" className="text-gray-500 line-clamp-2 mt-1 leading-relaxed">{rutina.descripcion}</Text>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar bg-black/40 rounded-[1.5rem] p-4 border border-white/5 mb-6">
                  <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                    <Text size="xs" weight="black" className="text-gray-400 uppercase tracking-tighter flex items-center gap-2">
                      <FaDumbbell className="text-purple-500" /> Plan de Ataque
                    </Text>
                    <Text size="xs" weight="black" className="text-purple-400">{rutina.ejercicios?.length || 0} EJS</Text>
                  </div>
                  <div className="space-y-2">
                    {rutina.ejercicios?.map((ej, idx) => (
                      <div key={idx} className="flex justify-between items-center group/ej">
                        <Text size="xs" className="text-gray-400 group-hover/ej:text-white transition-colors truncate pr-2 lowercase italic first-letter:uppercase">{ej.nombre}</Text>
                        <Text size="xs" weight="black" className="text-purple-400/80 whitespace-nowrap italic">
                          {ej.pivot ? `${ej.pivot.series}x${ej.pivot.repeticiones}` : `${ej.series || 0}x${ej.repeticiones || 0}`}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FaClock size={12} className="text-purple-500" />
                    <Text size="xs" weight="black" className="uppercase italic">{rutina.duracion || "45"} MIN</Text>
                  </div>
                  <Text size="xs" weight="black" variant="gradient" className="uppercase italic tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Ver Detalles</Text>
                </div>
              </div>
            </CardLayout>
          ))}
        </div>
      </main>

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