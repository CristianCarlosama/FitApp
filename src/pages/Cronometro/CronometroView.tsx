import React, { useState, useEffect, useRef } from "react";
// import Text from "../../components/Texts";
import { FaArrowLeft, FaPlay, FaStop, FaHistory, FaUndo } from "react-icons/fa";

interface Lap {
  id: number;
  time: number;
}

interface CronometroViewProps {
  goBack: () => void;
}

const CronometroView: React.FC<CronometroViewProps> = ({ goBack }) => {
  const [tiempo, setTiempo] = useState<number>(0);
  const [estaCorriendo, setEstaCorriendo] = useState<boolean>(false);
  const [vueltas, setVueltas] = useState<Lap[]>([]);
  const idIntervalo = useRef<ReturnType<typeof setInterval> | null>(null);

  const radio = 135;
  const circunferencia = 2 * Math.PI * radio;
  const progreso = ((tiempo % 60000) / 60000) * circunferencia;

  const iniciarCronometro = () => {
    if (estaCorriendo) return;
    setEstaCorriendo(true);
    idIntervalo.current = setInterval(() => {
      setTiempo((t) => t + 10);
    }, 10);
  };

  const pausarCronometro = () => {
    if (idIntervalo.current) {
      clearInterval(idIntervalo.current);
      idIntervalo.current = null;
    }
    setEstaCorriendo(false);
  };

  const reiniciarCronometro = () => {
    pausarCronometro();
    setTiempo(0);
    setVueltas([]);
  };

  const registrarVuelta = () => {
    if (tiempo === 0) return;
    const nuevaVuelta: Lap = {
      id: vueltas.length + 1,
      time: tiempo
    };
    setVueltas([nuevaVuelta, ...vueltas]);
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
      if (idIntervalo.current) clearInterval(idIntervalo.current);
    };
  }, []);

  return (
    <section className="flex flex-col h-screen p-4 bg-[#0f111a] text-white overflow-hidden">
      {/* Header */}
      <button onClick={goBack} className="flex items-center text-purple-500 mb-4 hover:text-purple-400 transition-all z-50 w-fit">
        <FaArrowLeft className="mr-2" /> <span className="font-black uppercase text-xs tracking-widest">Volver</span>
      </button>

      <div className="flex flex-col items-center justify-start flex-grow gap-8">
        
        {/* CONTENEDOR DEL CÍRCULO */}
        <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80 mt-4">
          {/* Glow de fondo dinámico */}
          <div className={`absolute inset-0 bg-purple-600 rounded-full blur-[60px] transition-opacity duration-700 ${estaCorriendo ? 'opacity-25' : 'opacity-5'}`}></div>

          {/* SVG Progress Bar */}
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 300 300">
            <circle
              cx="150"
              cy="150"
              r={radio}
              fill="transparent"
              stroke="#1f2232"
              strokeWidth="6"
            />
            <circle
              cx="150"
              cy="150"
              r={radio}
              fill="transparent"
              stroke="url(#neonGrad)"
              strokeWidth="8"
              strokeDasharray={circunferencia}
              strokeDashoffset={circunferencia - progreso}
              strokeLinecap="round"
              className="transition-all duration-75 ease-linear"
            />
            <defs>
              <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Tiempo Central */}
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-5xl md:text-6xl font-mono font-black tracking-tighter drop-shadow-2xl">
              {formatearTiempo(tiempo)}
            </span>
            <div className="h-1 w-12 bg-purple-500 rounded-full mt-2 opacity-50"></div>
          </div>
        </div>

        {/* CONTROLES */}
        <div className="flex items-center gap-6 z-50">
          <button 
            onClick={reiniciarCronometro}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
            title="Reiniciar"
          >
            <FaUndo className="text-gray-400 text-sm" />
          </button>

          {!estaCorriendo ? (
            <button 
              onClick={iniciarCronometro}
              className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:bg-purple-500 transition-all active:scale-95"
            >
              <FaPlay className="ml-1" />
            </button>
          ) : (
            <button 
              onClick={pausarCronometro}
              className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:bg-red-500 transition-all active:scale-95"
            >
              <FaStop />
            </button>
          )}

          <button 
            onClick={registrarVuelta}
            disabled={!estaCorriendo}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 disabled:opacity-20"
            title="Vuelta"
          >
            <FaHistory className="text-gray-400 text-sm" />
          </button>
        </div>

        {/* LISTA DE VUELTAS (LAPS) */}
        <div className="w-full max-w-md flex-grow overflow-y-auto no-scrollbar mt-4 border-t border-white/5">
          {vueltas.map((vuelta) => (
            <div key={vuelta.id} className="flex justify-between items-center py-4 border-b border-white/5 px-2 animate-fadeIn">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Vuelta {vuelta.id.toString().padStart(2, '0')}</span>
              <span className="font-mono font-bold text-purple-400">{formatearTiempo(vuelta.time)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CronometroView;