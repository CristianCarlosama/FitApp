import { useState } from "react";
import Text from "../../../components/Texts";
import { FaTimes, FaPlay, FaDumbbell, FaClock } from "react-icons/fa";

// El modal pequeño de info de ejercicio
const EjercicioInfoModal = ({ exercise, onClose }: any) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-[#1c1f2e] border border-white/10 w-full max-w-md rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
      <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white"><FaTimes /></button>
      <Text size="xl" weight="black" className="uppercase mb-4 text-purple-400">{exercise.nombre}</Text>
      <div className="aspect-video bg-black rounded-xl mb-4 overflow-hidden">
        {/* Aquí iría el video o foto del ejercicio */}
        <div className="w-full h-full flex items-center justify-center text-white/20"><FaPlay size={40}/></div>
      </div>
      <Text size="sm" className="text-gray-400 leading-relaxed mb-4">{exercise.descripcion || "Sin descripción disponible."}</Text>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="block text-[8px] font-black text-gray-500 uppercase">Clase</span>
            <span className="text-sm font-bold">{exercise.clase || "General"}</span>
        </div>
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="block text-[8px] font-black text-gray-500 uppercase">Descanso</span>
            <span className="text-sm font-bold">{exercise.descanso || "60"}s</span>
        </div>
      </div>
    </div>
  </div>
);

const RutinaDetalle = ({ rutina, onClose }: any) => {
  const [selectedEx, setSelectedEx] = useState<any>(null);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0f111a]/90 backdrop-blur-md" onClick={onClose} />
      
      {/* Contenedor Modal */}
      <div className="relative bg-[#161925] border border-white/10 w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        <button onClick={onClose} className="absolute top-8 right-8 z-10 text-gray-400 hover:text-white transition-colors">
          <FaTimes size={20} />
        </button>

        <div className="p-8 md:p-12 overflow-y-auto no-scrollbar">
          <div className="mb-8">
            <span className="bg-purple-600 text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] mb-4 inline-block">{rutina.dificultad}</span>
            <Text size="4xl" weight="black" className="uppercase tracking-tighter leading-none mb-4">{rutina.nombre}</Text>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl">{rutina.descripcion}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
             <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                <FaClock className="text-purple-500" />
                <div>
                    <span className="block text-[9px] font-black text-gray-500 uppercase">Duración</span>
                    <span className="font-bold">{rutina.duracion || 45} min</span>
                </div>
             </div>
             {/* Agrega más stats si quieres */}
          </div>

          <Text size="lg" weight="black" className="uppercase tracking-widest mb-4 flex items-center gap-2">
            <FaDumbbell className="text-purple-500" /> Lista de Ejercicios
          </Text>

          <div className="space-y-3">
            {rutina.ejercicios?.map((ej: any, i: number) => (
              <div 
                key={i} 
                onClick={() => setSelectedEx(ej)}
                className="group bg-white/5 hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/50 p-5 rounded-2xl flex justify-between items-center cursor-pointer transition-all active:scale-[0.98]"
              >
                <div>
                    <span className="block text-xs font-black uppercase group-hover:text-purple-400 transition-colors">{ej.nombre}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{ej.series} Series x {ej.repeticiones} Reps</span>
                </div>
                <div className="bg-white/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Text size="xs" weight="black">VER INFO</Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer con botón de comenzar */}
        <div className="p-8 bg-black/20 border-t border-white/5 flex justify-center">
            <button className="w-full md:w-auto bg-white text-black px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-95">
                Comenzar Entrenamiento
            </button>
        </div>
      </div>

      {/* SUB-MODAL DE EJERCICIO */}
      {selectedEx && (
        <EjercicioInfoModal exercise={selectedEx} onClose={() => setSelectedEx(null)} />
      )}
    </div>
  );
};

export default RutinaDetalle;