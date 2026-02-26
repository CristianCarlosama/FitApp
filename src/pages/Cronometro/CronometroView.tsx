import React, { useState, useEffect, useRef } from "react";
import Text from "../../components/Texts";
import { FaArrowLeft } from "react-icons/fa";

interface Lap {
  id:number;
  time:number;
}

interface CronometroViewProps {
  goBack: () => void;
}

const CronometroView: React.FC<CronometroViewProps> = ({ goBack }) => {
  const [tiempo, setTiempo] = useState<number>(0);
  const [estaCorriendo, setEstaCorriendo] = useState<boolean>(false);
  const [vueltas, setVueltas] = useState<Lap[]>([]);
  const idIntervalo = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const iniciarCronometro = () => {
    if (estaCorriendo) return;

    setEstaCorriendo(true);

    idIntervalo.current = setInterval(() => {
      setTiempo((tiempoAnterior) => tiempoAnterior + 10);
    },10);
  };

  const pausarCronometro = () => {
    if (idIntervalo.current) {
      clearInterval(idIntervalo.current);
      idIntervalo.current = null
    }
    setEstaCorriendo(false);
  };

  const formatearTiempo = (ms: number) => {
    const minutos = Math.floor(ms / 60000);
    const segundos = Math.floor((ms % 60000) / 1000);
    const centisegundos = Math.floor((ms % 1000) / 10);

    return `${minutos.toString().padStart(2, '0')}:${segundos
      .toString()
      .padStart(2, '0')}.${centisegundos.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (idIntervalo.current) {
        clearInterval(idIntervalo.current)
      }
    };
  }, []);

  return (
    <section className="flex flex-col h-full p-4 bg-[#0f111a] text-white">
      {/* Botón Volver */}
      <button onClick={goBack} className="flex items-center text-purple-500 mb-6 hover:text-purple-400 transition-colors">
        <FaArrowLeft className="mr-2" /> Volver
      </button>

      <div className="flex flex-col items-center justify-center flex-grow">
        {/* Pantalla del tiempo con efecto Neón */}
        <div className="relative mb-12">
          {/* Brillo de fondo */}
          <div className="absolute -inset-2 bg-purple-600 rounded-full blur-xl opacity-20"></div>
          
          <div className="relative bg-[#161925] border-2 border-purple-500/30 w-72 h-72 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Text className="text-6xl font-mono font-bold text-white tracking-tighter">
              {formatearTiempo(tiempo)}
            </Text>
          </div>
        </div>

        {/* Controles Dinámicos */}
        <div className="flex gap-8">
          {!estaCorriendo ? (
            <button 
              onClick={iniciarCronometro}
              className="bg-green-600 hover:bg-green-500 w-20 h-20 rounded-full flex items-center justify-center text-2xl transition-all active:scale-90 shadow-lg shadow-green-900/40"
            >
              ▶
            </button>
          ) : (
            <button 
              onClick={pausarCronometro}
              className="bg-red-600 hover:bg-red-500 w-20 h-20 rounded-full flex items-center justify-center text-2xl transition-all active:scale-90 shadow-lg shadow-red-900/40"
            >
              ◼
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CronometroView;