import React from "react";
import { FaCalendarDay, FaDumbbell, FaClock, FaClipboardList } from "react-icons/fa";

// --- COMPONENTES REUTILIZABLES ---
import Text from "../../../components/Texts";
import Modal from "../../../components/Modal";

interface CalendarioInfoProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; 
  fecha: string; 
}

const CalendarioInfo: React.FC<CalendarioInfoProps> = ({ isOpen, onClose, data, fecha }) => {
  const entrenamientos = data?.entrenamientos || [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="!p-0 !max-w-lg overflow-hidden flex flex-col"
    >
      {/* HEADER CON DEGRADADO */}
      <div className="relative h-36 flex-shrink-0 bg-gradient-to-b from-purple-600/30 to-transparent flex items-end px-8 pb-6">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-600/20 text-[8px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest text-purple-400 border border-purple-500/20 shadow-lg">
              RESUMEN DEL DÍA
            </span>
            <span className="bg-white/5 text-[8px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest border border-white/5 text-gray-400">
              <FaCalendarDay className="inline mr-1 mb-0.5" /> {fecha.toUpperCase()}
            </span>
          </div>
          <Text size="2xl" weight="black" className="uppercase tracking-tighter italic leading-none text-white">
            Bitácora de Sesión
          </Text>
        </div>
      </div>

      {/* CONTENIDO SCROLLABLE */}
      <div className="flex-1 overflow-y-auto p-8 pt-2 no-scrollbar max-h-[60vh]">
        {entrenamientos.length > 0 ? (
          <div className="space-y-8">
            {entrenamientos.map((ent: any, idx: number) => (
              <div key={ent.id || idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Info de la Sesión */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <Text size="lg" weight="black" variant="gradient" className="uppercase italic tracking-tighter">
                            {ent.nombre_rutina}
                        </Text>
                        <div className="flex items-center gap-2 opacity-50">
                            <FaClock size={10} className="text-purple-500" />
                            <Text size="xs" weight="bold" className="uppercase">{ent.hora} HS</Text>
                        </div>
                    </div>
                </div>

                {/* Notas de la sesión si existen */}
                {ent.notas && (
                    <p className="text-gray-500 text-[11px] leading-relaxed border-l-2 border-purple-500/30 pl-4 py-1 italic mb-6">
                        {ent.notas}
                    </p>
                )}

                {/* Lista de Ejercicios Realizados */}
                <div className="space-y-4">
                    <Text size="xs" weight="black" className="uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                        <FaDumbbell className="text-purple-500" size={10} /> Ejercicios Completados
                    </Text>
                    
                    {ent.ejercicios?.map((ej: any, i: number) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                            <Text size="sm" weight="black" className="uppercase text-white mb-3 block">
                                {ej.nombre}
                            </Text>
                            
                            {/* Grid de Series Realizadas */}
                            <div className="grid grid-cols-3 gap-2">
                                {ej.series?.map((s: any, si: number) => (
                                    <div key={si} className="bg-black/40 p-2 rounded-xl border border-white/5 flex flex-col items-center">
                                        <span className="text-[8px] font-black text-gray-500 uppercase mb-1">SET {si + 1}</span>
                                        <span className="text-[10px] font-black text-white">{s.peso}kg × {s.reps}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
            <FaClipboardList size={40} className="mb-4" />
            <Text size="sm" weight="black" className="uppercase tracking-widest">No hay registros de entrenamiento</Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CalendarioInfo;