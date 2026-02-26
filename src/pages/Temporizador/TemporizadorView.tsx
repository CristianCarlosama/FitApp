import React, { useState, useEffect, useRef } from "react";
import Text from "../../components/Texts";
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaBell } from "react-icons/fa";

interface TemporizadorViewProps {
  goBack: () => void;
}

const TemporizadorView: React.FC<TemporizadorViewProps> = ({ goBack }) => {
  // Tiempo inicial (ejemplo: 1 minuto = 60000ms)
  const TIEMPO_INICIAL = 60000; 
  const [tiempoRestante, setTiempoRestante] = useState<number>(TIEMPO_INICIAL);
  const [estaCorriendo, setEstaCorriendo] = useState<boolean>(false);
  const idIntervalo = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- LÓGICA DEL CÍRCULO INVERSO ---
  const radio = 135;
  const circunferencia = 2 * Math.PI * radio;
  
  // Calculamos el progreso para que se vacíe
  // A diferencia del cronómetro, aquí restamos la proporción del tiempo que queda
  const progreso = (tiempoRestante / TIEMPO_INICIAL) * circunferencia;

  const iniciarTemporizador = () => {
    if (estaCorriendo || tiempoRestante <= 0) return;
    setEstaCorriendo(true);
    idIntervalo.current = setInterval(() => {
      setTiempoRestante((t) => {
        if (t <= 10) {
          pausarTemporizador();
          return 0;
        }
        return t - 10;
      });
    }, 10);
  };

  const pausarTemporizador = () => {
    if (idIntervalo.current) {
      clearInterval(idIntervalo.current);
      idIntervalo.current = null;
    }
    setEstaCorriendo(false);
  };

  const reiniciarTemporizador = () => {
    pausarTemporizador();
    setTiempoRestante(TIEMPO_INICIAL);
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
      <button onClick={goBack} className="flex items-center text-orange-500 mb-4 hover:text-orange-400 transition-all z-50 w-fit">
        <FaArrowLeft className="mr-2" /> 
        <span className="font-black uppercase text-xs tracking-widest">Volver</span>
      </button>

      <div className="flex flex-col items-center justify-center flex-grow gap-12">
        
        {/* CONTENEDOR DEL CÍRCULO INVERSO */}
        <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80">
          {/* Glow de fondo (Naranja para diferenciarlo del cronómetro) */}
          <div className={`absolute inset-0 bg-orange-600 rounded-full blur-[60px] transition-opacity duration-700 ${estaCorriendo ? 'opacity-20' : 'opacity-5'}`}></div>

          {/* SVG Progress Bar Invertido */}
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
              stroke="url(#timerGrad)"
              strokeWidth="10"
              strokeDasharray={circunferencia}
              // Aquí ocurre la magia: el offset se basa en el tiempo que falta
              strokeDashoffset={circunferencia - progreso}
              strokeLinecap="round"
              className="transition-all duration-75 ease-linear"
            />
            <defs>
              <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>

          {/* Tiempo Central */}
          <div className="relative z-10 flex flex-col items-center">
            <span className={`text-5xl md:text-6xl font-mono font-black tracking-tighter transition-colors ${tiempoRestante < 10000 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {formatearTiempo(tiempoRestante)}
            </span>
            {tiempoRestante === 0 && (
              <Text size="xs" weight="black" className="text-orange-500 mt-2 uppercase tracking-[0.3em]">¡Tiempo!</Text>
            )}
          </div>
        </div>

        {/* CONTROLES */}
        <div className="flex items-center gap-8 z-50">
          <button 
            onClick={reiniciarTemporizador}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
          >
            <FaUndo className="text-gray-400" />
          </button>

          {!estaCorriendo ? (
            <button 
              onClick={iniciarTemporizador}
              className="w-24 h-24 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:bg-orange-500 transition-all active:scale-95"
            >
              <FaPlay size={24} className="ml-1" />
            </button>
          ) : (
            <button 
              onClick={pausarTemporizador}
              className="w-24 h-24 rounded-full border-2 border-orange-600 flex items-center justify-center text-orange-500 hover:bg-orange-600/10 transition-all active:scale-95"
            >
              <FaPause size={24} />
            </button>
          )}

          <div className="w-14 h-14 flex items-center justify-center">
            {tiempoRestante < 10000 && tiempoRestante > 0 && (
              <FaBell className="text-orange-500 animate-bounce" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemporizadorView;