import React, { useState, useEffect, useRef } from "react";
import Text from "../../components/Texts";
import { FaEdit, FaTrash, FaPlus, FaChevronLeft, FaDumbbell } from "react-icons/fa";
import { getEjercicios, deleteEjercicio, createEjercicio, updateEjercicio } from "../../services/ejercicios";
import { getMusculos } from "../../services/musculos"; // <--- Importado
import NotificationModal from "../../components/NotificationModal";
import type { NotificationType } from "../../components/NotificationModal";
import EjercicioForm from "../EjercicioDev/modales/EjerciciosFormCE";

// --- COMPONENTE CAROUSEL (Igual que en EjerciciosView para consistencia) ---
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
      <button 
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/5 backdrop-blur-md p-2.5 rounded-full border border-white/10 hover:bg-purple-600 transition-all shadow-lg"
      >
        <FaChevronLeft size={12} className="text-white" />
      </button>
      <div ref={scrollRef} className="flex overflow-x-auto gap-3 pb-2 no-scrollbar scroll-smooth">
        {children}
      </div>
      <button 
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/5 backdrop-blur-md p-2.5 rounded-full border border-white/10 hover:bg-purple-600 transition-all shadow-lg"
      >
        <FaChevronLeft size={12} className="text-white rotate-180" />
      </button>
    </div>
  );
};

interface Props {
  userRole: string | null;
  goBack: () => void;
}

const EjerciciosCRUD: React.FC<Props> = ({ userRole, goBack }) => {
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [musculosDB, setMusculosDB] = useState<any[]>([]); // <--- Filtros dinámicos
  const [filtro, setFiltro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedEj, setSelectedEj] = useState<any>(null);
  const [noti, setNoti] = useState<{
    isOpen: boolean; type: NotificationType; title: string; message: string; onConfirm?: () => void;
  }>({ isOpen: false, type: "info", title: "", message: "" });

  const closeNoti = () => setNoti(prev => ({ ...prev, isOpen: false }));

  // Carga inicial de datos
  const loadData = async () => {
    setLoading(true);
    try {
      const [ejData, musData] = await Promise.all([getEjercicios(), getMusculos()]);
      setEjercicios(ejData);
      setMusculosDB(musData);
    } catch (error) {
      console.error("Error cargando CRUD", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [userRole]);

  const handleSaveSuccess = async (data: any, isEdit: boolean) => {
    try {
      if (isEdit) await updateEjercicio(selectedEj.id, data);
      else await createEjercicio(data);
      
      setShowForm(false);
      loadData();
      setNoti({
        isOpen: true, type: "success", title: "¡Operación Exitosa!",
        message: `El ejercicio ha sido ${isEdit ? 'actualizado' : 'creado'} en el arsenal.`
      });
    } catch (error) {
      setNoti({ isOpen: true, type: "error", title: "Error", message: "Hubo un problema al procesar la solicitud." });
    }
  };

  const handleDeleteRequest = (ej: any) => {
    setNoti({
      isOpen: true, type: "delete", title: "¿Eliminar del Arsenal?",
      message: `Estas por borrar "${ej.nombre}". Los usuarios ya no podrán verlo.`,
      onConfirm: async () => {
        await deleteEjercicio(ej.id);
        loadData();
        closeNoti();
      }
    });
  };

  const filtered = filtro 
    ? ejercicios.filter(e => e.clase?.toLowerCase().trim() === filtro.toLowerCase().trim()) 
    : ejercicios;

  if (loading) return (
    <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin"></div>
        <FaDumbbell className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600 animate-pulse" />
      </div>
      <Text size="xs" weight="black" className="uppercase tracking-[0.4em] text-gray-500">Sincronizando Arsenal</Text>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f111a] text-white flex flex-col overflow-x-hidden">
      
      {/* HEADER / FILTROS */}
      <header className="sticky top-0 z-40 bg-[#0f111a]/95 backdrop-blur-xl border-b border-white/5 p-6">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <button onClick={goBack} className="group flex items-center gap-3 active:scale-95 transition-all">
              <FaChevronLeft className="text-purple-500 text-xl" />
              <div className="flex flex-col">
                <Text size="2xl" weight="black" variant="gradient" className="uppercase tracking-tighter leading-none italic">EJERCICIOS</Text>
                <Text size="xs" className="text-gray-500 font-bold uppercase tracking-[0.2em]">{filtered.length} Ejercicios</Text>
              </div>
            </button>

            <button 
              onClick={() => { setSelectedEj(null); setShowForm(true); }}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              <FaPlus size={10} />Nuevo
            </button>
          </div>

          <Carousel>
            <button 
              onClick={() => setFiltro(null)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase border transition-all ${!filtro ? "bg-purple-600 border-purple-600 shadow-lg shadow-purple-500/30 text-white" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"}`}
            >
              Todos
            </button>
            {musculosDB.map(m => (
              <button 
                key={m.id}
                onClick={() => setFiltro(m.nombre)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase border transition-all ${filtro === m.nombre ? "bg-purple-600 border-purple-600 shadow-lg shadow-purple-500/30 text-white" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"}`}
              >
                {m.nombre}
              </button>
            ))}
          </Carousel>
        </div>
      </header>

      {/* GRID DE EJERCICIOS */}
      <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full pb-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(ej => (
            <div key={ej.id} className="group bg-[#161925] rounded-[2rem] border border-white/5 overflow-hidden hover:border-purple-500/50 transition-all duration-300 flex flex-col shadow-xl">
              <div className="relative h-40 bg-black/40 overflow-hidden">
                <img 
                  src={
                    ej.foto_1 
                      ? `${import.meta.env.VITE_STORAGE_URL}/${ej.foto_1}` 
                      : 'https://via.placeholder.com/300x200?text=Ares+Fit'
                  } 
                  alt={ej.nombre} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                  <button onClick={() => { setSelectedEj(ej); setShowForm(true); }} className="p-3 bg-white text-black rounded-xl hover:bg-purple-600 hover:text-white transition-colors shadow-lg">
                    <FaEdit size={14} />
                  </button>
                  <button onClick={() => handleDeleteRequest(ej)} className="p-3 bg-white text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors shadow-lg">
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <span className="text-[9px] font-black uppercase text-purple-400 tracking-[0.2em]">{ej.clase || 'General'}</span>
                <Text size="lg" weight="black" className="uppercase truncate mt-1">{ej.nombre}</Text>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODALES */}
      {showForm && (
        <EjercicioForm 
          ejercicio={selectedEj} 
          onClose={() => setShowForm(false)} 
          onSuccess={handleSaveSuccess} 
          userRole={userRole}
        />
      )}

      <NotificationModal {...noti} onClose={closeNoti} />
    </div>
  );
};

export default EjerciciosCRUD;