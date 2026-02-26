import React, { useState, useEffect, useRef } from "react";
import Text from "../../components/Texts";
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaClock } from "react-icons/fa";

interface TemporizadorViewProps {
  goBack: () => void;
}

const TemporizadorView: React.FC<TemporizadorViewProps> = ({ goBack }) => {
  // Estado para el tiempo que el usuario elige (por defecto 1 min)
  const [tiempoMaximo, setTiempoMaximo] = useState<number>(60000); 
  const [tiempoRestante, setTiempoRestante] = useState<number>(60000);
  const [estaCorriendo, setEstaCorriendo] = useState<boolean>(false);
  const idIntervalo = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- LÓGICA DEL CÍRCULO AZUL ---
  const radio = 135;
  const circunferencia = 2 * Math.PI * radio;
  const progreso = (tiempoRestante / tiempoMaximo) * circunferencia;

  const seleccionarTiempo = (ms: number) => {
    pausarTemporizador();
    setTiempoMaximo(ms);
    setTiempoRestante(ms);
  };

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
    setTiempoRestante(tiempoMaximo);
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
      <button onClick={goBack} className="flex items-center text-blue-400 mb-4 hover:text-blue-300 transition-all z-50 w-fit">
        <FaArrowLeft className="mr-2" /> 
        <span className="font-black uppercase text-xs tracking-widest">Volver</span>
      </button>

      <div className="flex flex-col items-center justify-center flex-grow gap-8">
        
        {/* SELECTOR DE TIEMPO (Solo visible si no está corriendo) */}
        <div className={`flex gap-3 transition-all duration-500 ${estaCorriendo ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'}`}>
          {[60000, 300000, 600000].map((ms) => (
            <button
              key={ms}
              onClick={() => seleccionarTiempo(ms)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-all ${tiempoMaximo === ms ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-gray-400'}`}
            >
              {ms / 60000} MIN
            </button>
          ))}
        </div>

        {/* CONTENEDOR DEL CÍRCULO BLUE */}
        <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80">
          {/* Glow Azul */}
          <div className={`absolute inset-0 bg-blue-600 rounded-full blur-[70px] transition-opacity duration-700 ${estaCorriendo ? 'opacity-30' : 'opacity-10'}`}></div>

          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r={radio} fill="transparent" stroke="#1f2232" strokeWidth="6" />
            <circle
              cx="150"
              cy="150"
              r={radio}
              fill="transparent"
              stroke="url(#blueGrad)"
              strokeWidth="10"
              strokeDasharray={circunferencia}
              strokeDashoffset={circunferencia - progreso}
              strokeLinecap="round"
              className="transition-all duration-75 ease-linear"
            />
            <defs>
              <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" /> {/* text-blue-400 aprox */}
                <stop offset="100%" stopColor="#2563eb" /> {/* blue-600 */}
              </linearGradient>
            </defs>
          </svg>

          {/* Tiempo Central */}
          <div className="relative z-10 flex flex-col items-center">
            <span className={`text-5xl md:text-6xl font-mono font-black tracking-tighter drop-shadow-lg ${tiempoRestante === 0 ? 'text-blue-400 animate-pulse' : 'text-white'}`}>
              {formatearTiempo(tiempoRestante)}
            </span>
            <div className="flex items-center gap-2 mt-2 opacity-40">
                <FaClock size={10} className="text-blue-400" />
                <Text size="xs" weight="black" className="uppercase tracking-[0.2em]">{tiempoMaximo / 60000}m set</Text>
            </div>
          </div>
        </div>

        {/* CONTROLES */}
        <div className="flex items-center gap-8 z-50">
          <button 
            onClick={reiniciarTemporizador}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600/20 hover:border-blue-400/30 transition-all active:scale-90"
          >
            <FaUndo className="text-gray-400 hover:text-blue-400" />
          </button>

          {!estaCorriendo ? (
            <button 
              onClick={iniciarTemporizador}
              className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all active:scale-95"
            >
              <FaPlay size={24} className="ml-1" />
            </button>
          ) : (
            <button 
              onClick={pausarTemporizador}
              className="w-24 h-24 rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-400 hover:bg-blue-400/10 transition-all active:scale-95 shadow-[0_0_20px_rgba(96,165,250,0.2)]"
            >
              <FaPause size={24} />
            </button>
          )}

          <div className="w-14 h-14" /> {/* Espaciador para equilibrio visual */}
        </div>
      </div>
    </section>
  );
};

export default TemporizadorView;