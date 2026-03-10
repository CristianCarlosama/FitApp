import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaDumbbell, FaPlus } from "react-icons/fa";
import { getEjercicios, deleteEjercicio, createEjercicio, updateEjercicio } from "../../services/ejercicios";
import { getMusculos } from "../../services/musculos"; 

// --- COMPONENTES REUTILIZABLES ---
import Text from "../../components/Texts";
import Button from "../../components/Buttons";
import ViewHeader from "../../components/Header";
import NotificationModal from "../../components/NotificationModal";
import EjercicioForm from "../EjercicioDev/modales/EjerciciosFormCE";
import type { NotificationType } from "../../components/NotificationModal";

interface EjerciciosCRUDProps {
  userRole: string | null;
}

const EjerciciosCRUD: React.FC<EjerciciosCRUDProps> = ({ userRole }) => {
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [musculosDB, setMusculosDB] = useState<any[]>([]); 
  const [filtro, setFiltro] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedEj, setSelectedEj] = useState<any>(null);
  const [noti, setNoti] = useState<{
    isOpen: boolean; type: NotificationType; title: string; message: string; onConfirm?: () => void;
  }>({ isOpen: false, type: "info", title: "", message: "" });

  const closeNoti = () => setNoti(prev => ({ ...prev, isOpen: false }));

  const loadData = async () => {
    setLoading(true);
    try {
      const [ejData, musData] = await Promise.all([getEjercicios(), getMusculos()]);
      setEjercicios(ejData);
      setMusculosDB(musData);
    } catch (error) { 
      console.error("Error cargando ejercicios:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { loadData(); }, [userRole]);

  const filteredData = ejercicios.filter((ej) => {
    const matchesCategory = filtro 
      ? ej.clase?.toLowerCase().trim() === filtro.toLowerCase().trim() 
      : true;

    const matchesSearch = ej.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ej.clase?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleSaveSuccess = async (data: any, isEdit: boolean) => {
    try {
      if (isEdit) await updateEjercicio(selectedEj.id, data);
      else await createEjercicio(data);
      setShowForm(false);
      loadData();
      setNoti({
        isOpen: true, type: "success", title: "¡Arsenal Actualizado!",
        message: `El ejercicio fue ${isEdit ? 'editado' : 'creado'} correctamente.`
      });
    } catch (error) {
      setNoti({ isOpen: true, type: "error", title: "Error", message: "Algo salió mal." });
    }
  };

  const handleDeleteRequest = (ej: any) => {
    setNoti({
      isOpen: true, type: "delete", title: "¿Eliminar Ejercicio?",
      message: `Estas por borrar "${ej.nombre}".`,
      onConfirm: async () => {
        try {
          await deleteEjercicio(ej.id);
          loadData();
          closeNoti();
        } catch (error) {
          setNoti({ isOpen: true, type: "error", title: "Error", message: "No se pudo eliminar." });
        }
      }
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin"></div>
        <FaDumbbell className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600 animate-pulse" size={24} />
      </div>
      <Text size="xs" weight="black" className="uppercase tracking-[0.4em] text-gray-500">Sincronizando Arsenal</Text>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f111a] text-white flex flex-col overflow-x-hidden">
      {/* HEADER REUTILIZABLE */}
      <ViewHeader 
        title="ARES"
        subtitle={`Ejercicios / ${filtro || "Todos"}`}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar ejercicio..."
        activeFilter={filtro}
        filters={musculosDB.map(m => m.nombre)}
        onFilterClick={setFiltro}
      />

      {/* GRID DE EJERCICIOS */}
      <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full pb-32">
        <div className="flex justify-between items-end mb-10">
          <div>
            <Text size="3xl" weight="black" className="uppercase italic tracking-tighter">MOVIMIENTOS</Text>
            <Text size="xs" className="text-gray-500 font-bold uppercase tracking-widest mt-1">
              {filteredData.length} resultados encontrados
            </Text>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => { setSelectedEj(null); setShowForm(true); }}
            className="flex items-center gap-2 !px-6 shadow-lg shadow-purple-500/20"
          >
            <FaPlus /> NUEVO EJERCICIO
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredData.map(ej => (
            <div key={ej.id} className="group bg-[#161925] rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-purple-500/50 transition-all duration-500 flex flex-col shadow-2xl relative">
              
              {/* ACCIONES FLOTANTES */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 translate-x-16 group-hover:translate-x-0 transition-transform duration-300">
                <button 
                  onClick={() => { setSelectedEj(ej); setShowForm(true); }}
                  className="p-3 bg-white text-black rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-xl"
                >
                  <FaEdit size={12} />
                </button>
                <button 
                  onClick={() => handleDeleteRequest(ej)}
                  className="p-3 bg-white text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl"
                >
                  <FaTrash size={12} />
                </button>
              </div>

              {/* IMAGEN */}
              <div className="relative h-48 bg-black/40 overflow-hidden">
                <img 
                  src={ej.foto_1 ? `${import.meta.env.VITE_STORAGE_URL}/${ej.foto_1}` : 'https://via.placeholder.com/400x400?text=Ares+Fit'} 
                  alt={ej.nombre} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161925] to-transparent opacity-60" />
              </div>

              {/* TEXTO CARD */}
              <div className="p-6">
                <Text size="xs" weight="black" className="uppercase text-purple-500 tracking-widest mb-1 italic">
                  {ej.clase || 'Base'}
                </Text>
                <Text weight="black" size="md" className="uppercase truncate group-hover:text-purple-400 transition-colors italic">
                  {ej.nombre}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </main>

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