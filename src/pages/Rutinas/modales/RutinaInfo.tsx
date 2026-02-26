import { useState } from "react";
import Text from "../../../components/Texts";
import { FaTimes, FaDumbbell, FaFire, FaChevronRight } from "react-icons/fa";

const EjercicioInfoModal = ({ exercise, onClose }: any) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-300">
    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
    <div className="relative bg-[#161925] border border-white/10 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><FaTimes size={14} /></button>
      <Text size="lg" weight="black" variant="gradient" className="uppercase mb-4 text-center">{exercise.nombre}</Text>
      <div className="aspect-video bg-black/40 rounded-xl mb-4 overflow-hidden border border-white/5">
        <img src={exercise.foto_1 || exercise.imagen_url} className="w-full h-full object-cover" alt="" />
      </div>
      <div className="bg-white/5 p-3 rounded-xl border border-white/5 mb-4">
        <Text size="xs" className="text-gray-400 leading-tight italic line-clamp-3">
          {exercise.descripcion || "Enfoque en técnica y control."}
        </Text>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-purple-600/10 p-2 rounded-lg border border-purple-500/10 text-center">
          <span className="block text-[7px] font-black text-purple-400 uppercase tracking-tighter">Músculo</span>
          <span className="text-xs font-black uppercase text-white">{exercise.clase || "General"}</span>
        </div>
        <div className="bg-white/5 p-2 rounded-lg border border-white/5 text-center">
          <span className="block text-[7px] font-black text-gray-500 uppercase tracking-tighter">Descanso</span>
          <span className="text-xs font-black uppercase text-white">{exercise.descanso || "60"}s</span>
        </div>
      </div>
    </div>
  </div>
);

const RutinaDetalle = ({ rutina, onClose }: any) => {
  const [selectedEx, setSelectedEx] = useState<any>(null);
  const diffColor = rutina.dificultad === 'alta' ? 'bg-red-500' : rutina.dificultad === 'media' ? 'bg-orange-500' : 'bg-green-500';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#0f111a]/95 backdrop-blur-xl" 
        onClick={onClose} 
      />
      
      <div className="relative bg-[#161925] border border-white/10 w-full max-w-lg max-h-[80vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        
        <div className="relative h-32 flex-shrink-0 bg-gradient-to-b from-purple-600/10 to-transparent flex items-end px-8 pb-4">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-20 bg-black/40 p-2 rounded-full text-white hover:bg-purple-600 transition-all"
          >
            <FaTimes size={14} />
          </button>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`${diffColor} text-[7px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest shadow-lg`}>
                {rutina.dificultad}
              </span>
              <span className="bg-white/5 text-[7px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border border-white/5">
                {rutina.duracion || 45} MIN
              </span>
            </div>
            <Text size="2xl" weight="black" className="uppercase tracking-tighter italic leading-none">
              {rutina.nombre}
            </Text>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-2 no-scrollbar">
          <div className="mb-6">
            <p className="text-gray-500 text-[11px] leading-relaxed border-l-2 border-purple-500/30 pl-4 py-1 italic">
              {rutina.descripcion || "Sin descripción establecida para este plan."}
            </p>
          </div>

          <div className="mb-4">
            <Text size="xs" weight="black" className="uppercase tracking-[0.2em] text-gray-600 flex items-center gap-2">
              <FaDumbbell className="text-purple-500" size={10} /> Arsenal de Ejercicios
            </Text>
          </div>

          <div className="space-y-2">
            {rutina.ejercicios?.map((ej: any, i: number) => (
              <div 
                key={i} 
                onClick={() => setSelectedEx(ej)}
                className="group bg-white/5 hover:bg-white/[0.08] border border-white/5 hover:border-purple-500/30 p-3 rounded-2xl flex justify-between items-center cursor-pointer transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 bg-black/40 rounded-lg flex items-center justify-center font-black text-[10px] text-purple-500 border border-white/5">
                    {i + 1}
                  </div>
                  <div>
                    <span className="block text-xs font-black uppercase tracking-tight group-hover:text-purple-400 transition-colors">
                      {ej.nombre}
                    </span>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-[9px] text-gray-600 font-bold uppercase">{ej.series} Series</span>
                      <span className="text-[9px] text-purple-900">•</span>
                      <span className="text-[9px] text-gray-600 font-bold uppercase">{ej.repeticiones} Reps</span>
                    </div>
                  </div>
                </div>
                <FaChevronRight size={10} className="text-gray-800 group-hover:text-purple-500 transition-colors mr-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Botón Principal más ajustado */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5">
          <button className="w-full bg-purple-600 text-white py-4 rounded-xl font-black uppercase tracking-[0.15em] text-[10px] hover:bg-purple-500 transition-all shadow-xl shadow-purple-900/20 active:scale-[0.97] flex items-center justify-center gap-2">
            <FaFire size={12} /> Comenzar Entrenamiento
          </button>
        </div>
      </div>

      {/* SUB-MODAL */}
      {selectedEx && <EjercicioInfoModal exercise={selectedEx} onClose={() => setSelectedEx(null)} />}
    </div>
  );
};

export default RutinaDetalle;