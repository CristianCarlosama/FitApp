import React, { useState, useEffect } from "react";
import Text from "../../components/Texts";
import { FaEdit, FaTrash, FaPlus, FaChevronLeft } from "react-icons/fa";
import { getEjercicios, deleteEjercicio, createEjercicio, updateEjercicio } from "../../services/ejercicios";
import NotificationModal from "../../components/NotificationModal";
import type { NotificationType } from "../../components/NotificationModal"
import EjercicioForm from "../EjercicioDev/modales/EjerciciosFormCE";

const clases = ["pecho", "espalda", "piernas", "hombros", "brazos", "cardio"];

interface Props {
  userRole: string | null;
  goBack: () => void;
}

const EjerciciosCRUD: React.FC<Props> = ({ userRole, goBack }) => {
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [filtro, setFiltro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para Modales
  const [showForm, setShowForm] = useState(false);
  const [selectedEj, setSelectedEj] = useState<any>(null);
  
  // Estado para el NotificationModal reutilizable
  const [noti, setNoti] = useState<{
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, type: "info", title: "", message: "" });

  const closeNoti = () => setNoti(prev => ({ ...prev, isOpen: false }));

  const fetchEjercicios = async () => {
    setLoading(true);
    const data = await getEjercicios();
    setEjercicios(data);
    setLoading(false);
  };

  useEffect(() => { fetchEjercicios(); }, [userRole]);

  const handleSaveSuccess = async (data: any, isEdit: boolean) => {
    try {
      if (isEdit) {
        await updateEjercicio(selectedEj.id, data); // <--- acá llama al PUT
      } else {
        await createEjercicio(data);
      }
      setShowForm(false);
      fetchEjercicios();
      setNoti({
        isOpen: true,
        type: "success",
        title: "¡Éxito!",
        message: `Ejercicio ${isEdit ? 'actualizado' : 'creado'} correctamente.`
      });
    } catch (error) {
      setNoti({ isOpen: true, type: "error", title: "Error", message: "No se pudo guardar el ejercicio." });
    }
  };

  const handleDeleteRequest = (ej: any) => {
    setNoti({
      isOpen: true,
      type: "delete",
      title: "¿Eliminar ejercicio?",
      message: `Vas a borrar "${ej.nombre}". Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        await deleteEjercicio(ej.id);
        fetchEjercicios();
        closeNoti();
      }
    });
  };

  const filtered = filtro ? ejercicios.filter(e => e.clase?.toLowerCase() === filtro) : ejercicios;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
        <Text size="sm" weight="black" className="uppercase tracking-[0.3em] text-purple-500 animate-pulse">
          Cargando Ares...
        </Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f111a] text-white flex flex-col overflow-x-hidden">
      
      {/* HEADER / FILTROS */}
      <header className="sticky top-0 z-40 bg-[#0f111a]/90 backdrop-blur-xl border-b border-white/5 p-6">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="flex justify-between items-center mb-6">
            <button onClick={goBack} className="group flex items-center gap-3 active:scale-95 transition-all">
              <FaChevronLeft className="text-purple-500" />
              <Text size="xl" weight="black" variant="gradient" className="uppercase tracking-tighter">GESTIÓN ARES</Text>
            </button>

            <button 
              onClick={() => { setSelectedEj(null); setShowForm(true); }}
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all active:scale-95"
            >
              <FaPlus /> Nuevo
            </button>
          </div>

          {/* Carrusel de Clases */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setFiltro(null)}
              className={`flex-shrink-0 px-6 py-2 rounded-full text-[10px] font-black uppercase border transition-all ${!filtro ? "bg-purple-600 border-purple-600 shadow-lg shadow-purple-500/30" : "bg-white/5 border-white/10 text-gray-400"}`}
            >
              Todos
            </button>
            {clases.map(c => (
              <button 
                key={c}
                onClick={() => setFiltro(c)}
                className={`flex-shrink-0 px-6 py-2 rounded-full text-[10px] font-black uppercase border transition-all ${filtro === c ? "bg-purple-600 border-purple-600 shadow-lg shadow-purple-500/30" : "bg-white/5 border-white/10 text-gray-400"}`}
              >
                {c}
              </button>
            ))}
          </div>
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

      {/* MODAL FORMULARIO */}
      {showForm && (
        <EjercicioForm 
          ejercicio={selectedEj} 
          onClose={() => setShowForm(false)} 
          onSuccess={handleSaveSuccess} 
          userRole={userRole}
        />
      )}

      {/* MODAL NOTIFICACIONES (TU COMPONENTE REUTILIZABLE) */}
      <NotificationModal {...noti} onClose={closeNoti} />
    </div>
  );
};

export default EjerciciosCRUD;