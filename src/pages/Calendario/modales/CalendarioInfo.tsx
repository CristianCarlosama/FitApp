import React from "react";
import { FaDumbbell, FaRulerCombined, FaHistory } from "react-icons/fa";

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
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="!p-0 !max-w-lg overflow-hidden flex flex-col"
    >
      {/* HEADER CON DEGRADADO (Estilo RutinaDetalle) */}
      <div className="relative h-32 flex-shrink-0 bg-gradient-to-b from-purple-600/30 to-transparent flex items-end px-8 pb-6">
        <div className="w-full">
          <Text size="xs" weight="black" className="text-purple-500 uppercase tracking-[0.2em] mb-1">
            <FaHistory className="inline mr-2" /> Resumen del Día
          </Text>
          <Text size="2xl" weight="black" className="uppercase tracking-tighter italic leading-none text-white">
            {fecha}
          </Text>
        </div>
      </div>

      {/* CONTENIDO SCROLLABLE */}
      <div className="flex-1 overflow-y-auto p-8 pt-2 no-scrollbar max-h-[60vh]">
        {data ? (
          <div className="space-y-8">
            
            {/* SECCIÓN RUTINA */}
            {data.rutina && (
              <div className="space-y-4">
                <Text size="xs" weight="black" className="uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <FaDumbbell className="text-purple-500" size={10} /> Entrenamiento Realizado
                </Text>

                <div className="bg-white/[0.03] border border-white/5 p-5 rounded-[2rem]">
                  <Text size="lg" weight="black" className="italic uppercase text-purple-400 mb-2">
                    {data.rutina.nombre}
                  </Text>
                  
                  {data.rutina.notasGenerales && (
                    <p className="text-gray-500 text-[11px] leading-relaxed border-l-2 border-yellow-500/30 pl-4 py-1 italic mb-4">
                      {data.rutina.notasGenerales}
                    </p>
                  )}

                  {/* LISTA DE EJERCICIOS (Estilo simplificado del historial) */}
                  <div className="space-y-3 mt-4">
                    {data.rutina.ejercicios.map((ej: any, i: number) => (
                      <div key={i} className="bg-black/20 border border-white/5 p-4 rounded-2xl">
                        <Text size="xs" weight="black" className="uppercase italic text-white mb-3">
                          {ej.nombre}
                        </Text>
                        <div className="grid grid-cols-2 gap-2">
                          {ej.series.map((s: any, si: number) => (
                            <div key={si} className="bg-white/5 p-2 rounded-xl flex justify-between items-center px-3 border border-white/5">
                              <span className="text-[9px] font-black text-gray-500 uppercase">Set {si + 1}</span>
                              <span className="text-[11px] font-black text-white">{s.peso}kg <span className="text-purple-500">x</span> {s.reps}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN MEDIDAS */}
            {data.medidas && (
              <div className="space-y-4">
                <Text size="xs" weight="black" className="uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <FaRulerCombined className="text-cyan-500" size={10} /> Biometría
                </Text>
                <div className="bg-cyan-500/5 border border-cyan-500/10 p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <Text size="sm" weight="black" className="uppercase italic text-white">Peso Corporal</Text>
                    <Text size="xs" className="text-gray-500">Progreso registrado</Text>
                  </div>
                  <Text size="xl" weight="black" className="text-cyan-400 font-mono">
                    {data.medidas.pesoCorporal} <span className="text-[10px]">KG</span>
                  </Text>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 opacity-30">
            <FaHistory size={40} className="mx-auto" />
            <Text size="xs" weight="bold" className="uppercase tracking-widest">No hay registros para esta fecha</Text>
          </div>
        )}
      </div>

      {/* FOOTER PARA CERRAR (Igual al estilo de tus otros modales) */}
      <div className="p-8 pt-4 bg-[#161925] border-t border-white/5">
        <button 
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
        >
          Cerrar Bitácora
        </button>
      </div>
    </Modal>
  );
};

export default CalendarioInfo;