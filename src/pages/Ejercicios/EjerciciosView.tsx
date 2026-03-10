import React, { useEffect, useState } from "react";
import { FaDumbbell, FaFire, FaSearch } from "react-icons/fa";

// --- SERVICIOS ---
import { getEjercicios } from "../../services/ejercicios";
import { getMusculos } from "../../services/musculos";

// --- COMPONENTES REUTILIZABLES ---
import Text from "../../components/Texts";
import Button from "../../components/Buttons";
import CardLayout from "../../components/CardLayout";
import EjercicioDetalleModal from "./modales/EjercicioDetalle";
import ViewHeader from "../../components/Header"; 
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

const EjerciciosView: React.FC = () => {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [musculosDB, setMusculosDB] = useState<{id: number, nombre: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClase, setSelectedClase] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Ejercicio | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [ejerciciosData, musculosData] = await Promise.all([
          getEjercicios(),
          getMusculos()
        ]);
        setEjercicios(ejerciciosData);
        setMusculosDB(musculosData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredEjercicios = ejercicios.filter((e) => {
    const nombre = e.nombre?.toLowerCase() || "";
    const busqueda = searchTerm.toLowerCase();
    const matchesSearch = nombre.includes(busqueda);

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
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <FaDumbbell className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-500 animate-pulse" size={20} />
        </div>
        <Text size="xs" weight="black" className="uppercase tracking-[0.3em] text-gray-400">Desbloqueando Ejercicios...</Text>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0f111a]">
      {/* HEADER REUTILIZABLE */}
      <ViewHeader 
        title="ARES"
        subtitle={`Ejercicios / ${selectedClase || "Explorar"}`}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por nombre..."
        activeFilter={selectedClase}
        filters={musculosDB.map(m => m.nombre)} 
        onFilterClick={setSelectedClase}
      />

      {/* MAIN CONTENT */}
      <main className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex-1">
        <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col">
              <Text size="3xl" weight="black" className="uppercase italic tracking-tighter">Explorar</Text>
              <Text size="xs" className="text-gray-500 font-bold uppercase tracking-[0.2em]">
                {filteredEjercicios.length} unidades disponibles
              </Text>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEjercicios.length > 0 ? (
            filteredEjercicios.map((e) => (
              <CardLayout 
                key={e.id} 
                onClick={() => setSelectedExercise(e)} 
                className="group flex flex-col h-[400px] !p-0 overflow-hidden border-white/5 hover:border-purple-500/50 transition-all duration-500 cursor-pointer"
              >
                {/* Imagen del ejercicio */}
                <div className="relative h-48 bg-gray-900 overflow-hidden shrink-0">
                  {e.foto_1 ? (
                    <img 
                      src={`${import.meta.env.VITE_STORAGE_URL}/${e.foto_1}`} 
                      alt={e.nombre} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-900/10">
                      <FaDumbbell className="text-purple-500/20 text-5xl rotate-45" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161925] to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-purple-600 text-[8px] font-black uppercase px-3 py-1 rounded-md tracking-widest shadow-xl">
                      {e.clase}
                    </span>
                  </div>
                </div>

                {/* Info del ejercicio */}
                <div className="p-6 flex flex-col flex-1 justify-between bg-[#161925]">
                  <div>
                    <Text size="lg" weight="black" className="uppercase tracking-tight mb-2 group-hover:text-purple-400 transition-colors">
                      {e.nombre}
                    </Text>
                    <Text size="xs" className="text-gray-500 line-clamp-2 italic leading-relaxed">
                      {e.descripcion || "Optimiza tu biomecánica con este movimiento técnico."}
                    </Text>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                      <FaFire size={8} className="text-purple-500" />
                      <span className="text-[9px] font-black text-gray-400 uppercase">{e.clase}</span>
                    </div>
                    {e.musculos_secundarios?.slice(0, 2).map((m, idx) => (
                      <div key={idx} className="bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                        <span className="text-[9px] font-black text-gray-500 uppercase">{m.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardLayout>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <FaSearch size={24} className="text-gray-700" />
              </div>
              <Text weight="black" size="lg" className="uppercase tracking-widest text-gray-500 mb-2">Sin coincidencias</Text>
              <Button variant="glass" size="sm" onClick={() => {setSearchTerm(""); setSelectedClase(null)}}>
                Limpiar Arsenal
              </Button>
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