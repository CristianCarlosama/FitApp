import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaPlay, FaPause, FaUndo, FaClock } from "react-icons/fa";

interface TemporizadorViewProps {
  goBack: () => void;
}

const TemporizadorView: React.FC<TemporizadorViewProps> = ({ goBack }) => {
  const [tiempoMaximo, setTiempoMaximo] = useState<number>(60000); 
  const [tiempoRestante, setTiempoRestante] = useState<number>(60000);
  const [estaCorriendo, setEstaCorriendo] = useState<boolean>(false);
  
  // Estados para los inputs manuales
  const [h, setH] = useState<string>("00");
  const [m, setM] = useState<string>("01");
  const [s, setS] = useState<string>("00");

  const idIntervalo = useRef<ReturnType<typeof setInterval> | null>(null);

  const radio = 135;
  const circunferencia = 2 * Math.PI * radio;
  const progreso = (tiempoRestante / tiempoMaximo) * circunferencia;

  // Actualizar el tiempo total basado en HH:MM:SS
  const actualizarDesdeInputs = (hours: string, mins: string, secs: string) => {
    const totalMs = (parseInt(hours || "0") * 3600000) + 
                    (parseInt(mins || "0") * 60000) + 
                    (parseInt(secs || "0") * 1000);
    
    if (totalMs > 0) {
      pausarTemporizador();
      setTiempoMaximo(totalMs);
      setTiempoRestante(totalMs);
    }
  };

  const seleccionarTiempoPredefinido = (ms: number) => {
    pausarTemporizador();
    setTiempoMaximo(ms);
    setTiempoRestante(ms);
    // Sincronizar inputs
    const totalSegundos = ms / 1000;
    setH(Math.floor(totalSegundos / 3600).toString().padStart(2, '0'));
    setM(Math.floor((totalSegundos % 3600) / 60).toString().padStart(2, '0'));
    setS(Math.floor(totalSegundos % 60).toString().padStart(2, '0'));
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

  const formatearTiempoDisplay = (ms: number) => {
    const horas = Math.floor(ms / 3600000);
    const minutos = Math.floor((ms % 3600000) / 60000);
    const segundos = Math.floor((ms % 60000) / 1000);
    
    const hDisplay = horas > 0 ? horas.toString().padStart(2, '0') + ':' : '';
    const mDisplay = minutos.toString().padStart(2, '0') + ':';
    const sDisplay = segundos.toString().padStart(2, '0');
    
    return `${hDisplay}${mDisplay}${sDisplay}`;
  };

  useEffect(() => {
    return () => { if (idIntervalo.current) clearInterval(idIntervalo.current); };
  }, []);

  return (
    <section className="flex flex-col h-screen p-4 bg-[#0f111a] text-white overflow-hidden font-sans">
      {/* Header */}
      <button onClick={goBack} className="flex items-center text-blue-400 mb-4 hover:text-blue-300 transition-all z-50 w-fit">
        <FaArrowLeft className="mr-2" /> 
        <span className="font-black uppercase text-[10px] tracking-[0.3em]">Volver</span>
      </button>

      <div className="flex flex-col items-center justify-center flex-grow gap-6">
        
        {/* SELECTOR PREDEFINIDO */}
        <div className={`flex gap-2 transition-all duration-500 ${estaCorriendo ? 'opacity-0 -translate-y-4' : 'opacity-100'}`}>
          {[60, 300, 600].map((seg) => (
            <button
              key={seg}
              onClick={() => seleccionarTiempoPredefinido(seg * 1000)}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black border transition-all ${tiempoMaximo === seg * 1000 ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-white/5 border-white/10 text-gray-500'}`}
            >
              {seg / 60}M
            </button>
          ))}
        </div>

        {/* INPUTS DE TIEMPO PERSONALIZADO */}
        <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${estaCorriendo ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex flex-col items-center">
              <input type="number" value={h} onChange={(e) => { setH(e.target.value); actualizarDesdeInputs(e.target.value, m, s); }} className="bg-transparent w-12 text-center text-xl font-black focus:text-blue-400 outline-none" placeholder="00"/>
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Horas</span>
            </div>
            <span className="text-xl font-black text-blue-500 mx-1 mb-4">:</span>
            <div className="flex flex-col items-center">
              <input type="number" value={m} onChange={(e) => { setM(e.target.value); actualizarDesdeInputs(h, e.target.value, s); }} className="bg-transparent w-12 text-center text-xl font-black focus:text-blue-400 outline-none" placeholder="01"/>
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Minutos</span>
            </div>
            <span className="text-xl font-black text-blue-500 mx-1 mb-4">:</span>
            <div className="flex flex-col items-center">
              <input type="number" value={s} onChange={(e) => { setS(e.target.value); actualizarDesdeInputs(h, m, e.target.value); }} className="bg-transparent w-12 text-center text-xl font-black focus:text-blue-400 outline-none" placeholder="00"/>
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Segundos</span>
            </div>
          </div>
        </div>

        {/* CÍRCULO PRINCIPAL */}
        <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80">
          <div className={`absolute inset-0 bg-blue-600 rounded-full blur-[80px] transition-opacity duration-1000 ${estaCorriendo ? 'opacity-25' : 'opacity-5'}`}></div>
          
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r={radio} fill="transparent" stroke="#161926" strokeWidth="8" />
            <circle
              cx="150" cy="150" r={radio}
              fill="transparent"
              stroke="url(#blueGrad)"
              strokeWidth="12"
              strokeDasharray={circunferencia}
              strokeDashoffset={circunferencia - progreso}
              strokeLinecap="round"
              className="transition-all duration-75 ease-linear shadow-blue-500"
            />
            <defs>
              <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative z-10 flex flex-col items-center">
            <span className={`text-5xl md:text-6xl font-mono font-black tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] ${tiempoRestante === 0 ? 'text-blue-400 animate-pulse' : 'text-white'}`}>
              {formatearTiempoDisplay(tiempoRestante)}
            </span>
            <div className="flex items-center gap-2 mt-3 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                <FaClock size={8} className="text-blue-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-blue-200">Set Goal</span>
            </div>
          </div>
        </div>

        {/* CONTROLES */}
        <div className="flex items-center gap-10 mt-4">
          <button onClick={reiniciarTemporizador} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600/20 transition-all active:scale-90">
            <FaUndo size={16} className="text-gray-500" />
          </button>

          {!estaCorriendo ? (
            <button onClick={iniciarTemporizador} className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-[0_15px_30px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:-translate-y-1 transition-all active:scale-95">
              <FaPlay size={24} className="ml-1" />
            </button>
          ) : (
            <button onClick={pausarTemporizador} className="w-20 h-20 rounded-3xl border-2 border-blue-500 flex items-center justify-center text-blue-400 bg-blue-500/5 transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              <FaPause size={24} />
            </button>
          )}

          <div className="w-12 h-12" />
        </div>
      </div>
    </section>
  );
};

export default TemporizadorView;