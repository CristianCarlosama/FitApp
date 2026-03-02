import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaPlay, FaStop, FaUndo, FaClock, FaBolt } from "react-icons/fa";
import Text from "../../components/Texts";
import Button from "../../components/Buttons";

interface TemporizadorViewProps {
  goBack: () => void;
}

const TemporizadorView: React.FC<TemporizadorViewProps> = ({ goBack }) => {
  const [tiempoMaximo, setTiempoMaximo] = useState<number>(60000); 
  const [tiempoRestante, setTiempoRestante] = useState<number>(60000);
  const [estaCorriendo, setEstaCorriendo] = useState<boolean>(false);
  const [esOvertime, setEsOvertime] = useState<boolean>(false);
  const esOvertimeRef = useRef(false);

  const [h, setH] = useState<string>("00");
  const [m, setM] = useState<string>("01");
  const [s, setS] = useState<string>("00");

  const idIntervalo = useRef<ReturnType<typeof setInterval> | null>(null);

  const radio = 135;
  const circunferencia = 2 * Math.PI * radio;
  const progreso = esOvertime ? 0 : (tiempoRestante / tiempoMaximo) * circunferencia;

  const actualizarDesdeInputs = (hours: string, mins: string, secs: string) => {
    const totalMs = (parseInt(hours || "0") * 3600000) + 
                    (parseInt(mins || "0") * 60000) + 
                    (parseInt(secs || "0") * 1000);
    
    if (totalMs > 0) {
      pausarTemporizador();
      setEsOvertime(false);
      setTiempoMaximo(totalMs);
      setTiempoRestante(totalMs);
    }
  };

  const agregarTiempoExtra = (ms: number) => {
    setTiempoRestante(prev => prev + ms);
    if (!esOvertime) setTiempoMaximo(prev => prev + ms);
  };

  const iniciarTemporizador = () => {
    if (estaCorriendo) return;
    setEstaCorriendo(true);

    idIntervalo.current = setInterval(() => {
      setTiempoRestante((t) => {
        if (!esOvertimeRef.current && t <= 0) {
          setEsOvertime(true);
          return 1000;
        }
        return esOvertimeRef.current ? t + 1000 : t - 1000;
      });
    }, 1000);
  };

  useEffect(() => {
    esOvertimeRef.current = esOvertime;
  }, [esOvertime]);

  const pausarTemporizador = () => {
    if (idIntervalo.current) {
      clearInterval(idIntervalo.current);
      idIntervalo.current = null;
    }
    setEstaCorriendo(false);
  };

  const reiniciarTemporizador = () => {
    pausarTemporizador();
    setEsOvertime(false);
    setTiempoRestante(tiempoMaximo);
  };

  const formatearTiempoDisplay = (ms: number) => {
    const totalSegundos = Math.floor(Math.abs(ms) / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    
    const hDisplay = horas > 0 ? horas.toString().padStart(2, '0') + ':' : '';
    const mDisplay = minutos.toString().padStart(2, '0') + ':';
    const sDisplay = segundos.toString().padStart(2, '0');
    
    return `${hDisplay}${mDisplay}${sDisplay}`;
  };

  useEffect(() => {
    return () => { if (idIntervalo.current) clearInterval(idIntervalo.current); };
  }, []);

  return (
    <section className="flex flex-col h-full max-h-[calc(100vh-20px)] p-6 bg-[#0f111a] text-white overflow-y-auto no-scrollbar font-sans">
      <header className="flex items-center justify-between mb-4">
        <button onClick={goBack} className="flex items-center gap-3 active:scale-95 transition-all">
          <FaArrowLeft className="text-purple-500" />
          <div className="flex flex-col items-start">
            <Text size="xl" weight="black" variant="gradient" className="uppercase leading-none italic">ARES</Text>
            <Text size="xs" className="text-gray-500 font-bold tracking-widest uppercase italic">Temporizador</Text>
          </div>
        </button>
        <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <FaBolt className={estaCorriendo ? "text-yellow-400 animate-pulse" : "text-gray-600"} />
        </div>
      </header>
      <div className="flex flex-col items-center justify-between flex-grow gap-4 py-2">
        {/* INPUTS DE TIEMPO PERSONALIZADO */}
        <div className={`transition-all duration-500 ${estaCorriendo ? 'opacity-0 scale-75 pointer-events-none absolute' : 'flex flex-col items-center gap-2 relative'}`}>
          <div className="flex items-center bg-white/5 p-3 rounded-[2rem] border border-white/10 backdrop-blur-md">
            {[ {v: h, set: setH, label: 'H'}, {v: m, set: setM, label: 'M'}, {v: s, set: setS, label: 'S'} ].map((item, idx) => (
              <React.Fragment key={item.label}>
                <div className="flex flex-col items-center px-2">
                  <input 
                    type="number" 
                    value={item.v} 
                    onChange={(e) => { 
                      const val = e.target.value.slice(0, 2);
                      item.set(val); 
                      actualizarDesdeInputs(idx === 0 ? val : h, idx === 1 ? val : m, idx === 2 ? val : s); 
                    }} 
                    className="bg-transparent w-12 text-center text-2xl font-black focus:text-purple-400 outline-none"
                  />
                  <Text size="xs" weight="black" className="text-gray-500 uppercase">{item.label}</Text>
                </div>
                {idx < 2 && <span className="text-xl font-black text-purple-500/50 mb-5">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* CÍRCULO PRINCIPAL */}
        <div className="relative flex items-center justify-center w-64 h-64 md:w-72 md:h-72 my-2">
          <div className={`absolute inset-0 rounded-full blur-[80px] transition-all duration-1000 
            ${esOvertime ? 'bg-red-600 opacity-30 animate-pulse' : estaCorriendo ? 'bg-indigo-600/20' : 'bg-purple-600/5'}`}>
          </div>
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r={radio} fill="transparent" stroke="#161926" strokeWidth="8" />
            <circle
              cx="150" cy="150" r={radio}
              fill="transparent"
              stroke={esOvertime ? "#ef4444" : "url(#timerGrad)"}
              strokeWidth="12"
              strokeDasharray={circunferencia}
              strokeDashoffset={circunferencia - progreso}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative z-10 flex flex-col items-center">
            {esOvertime && (
              <Text size="xs" weight="black" className="text-red-500 uppercase tracking-[0.3em] mb-1 animate-bounce">OVERTIME</Text>
            )}
            <span className={`text-6xl md:text-7xl font-black tracking-tighter tabular-nums drop-shadow-2xl 
              ${esOvertime ? 'text-red-500' : 'text-white'}`}>
              {esOvertime ? `+${formatearTiempoDisplay(tiempoRestante)}` : formatearTiempoDisplay(tiempoRestante)}
            </span>
            <div className={`flex items-center gap-2 mt-2 px-3 py-1 rounded-full border transition-all
              ${esOvertime ? 'bg-red-500/10 border-red-500/20' : 'bg-purple-500/10 border-purple-500/20'}`}>
                <FaClock size={8} className={esOvertime ? 'text-red-400' : 'text-purple-400'} />
                <Text size="xs" weight="black" className={`uppercase italic text-[10px] ${esOvertime ? 'text-red-200' : 'text-purple-200'}`}>
                  {esOvertime ? 'Excedido' : 'Objetivo'}
                </Text>
            </div>
          </div>
        </div>

        {/* CONTROLES (Misma animación y estilo que Cronómetro) */}
        <div className="flex flex-col items-center gap-6 w-full">
          <div className={`flex gap-4 transition-all duration-500 ${estaCorriendo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <Button variant="glass" size="sm" onClick={() => agregarTiempoExtra(15000)} className="!rounded-xl !bg-white/5 border-white/10 italic font-black text-purple-400 !px-4 hover:bg-purple-500/10">
              +15S
            </Button>
            <Button variant="glass" size="sm" onClick={() => agregarTiempoExtra(30000)} className="!rounded-xl !bg-white/5 border-white/10 italic font-black text-purple-400 !px-4 hover:bg-purple-500/10">
              +30S
            </Button>
          </div>

          <div className="flex items-center gap-8">
            <Button 
              variant="glass" 
              className="!w-14 !h-14 !rounded-3xl border-white/5 bg-white/5 flex items-center justify-center hover:bg-red-500/10 group transition-all" 
              onClick={reiniciarTemporizador}
            >
              <FaUndo size={16} className="text-gray-500 group-hover:text-red-400" />
            </Button>

            <Button 
              variant="primary" 
              onClick={estaCorriendo ? pausarTemporizador : iniciarTemporizador}
              className={`!w-24 !h-24 !rounded-[2.5rem] !p-0 shadow-2xl transition-all duration-500 active:scale-90 
                ${estaCorriendo 
                  ? 'from-orange-600 to-red-600 shadow-red-500/40 rotate-180' 
                  : 'from-blue-500 via-indigo-500 to-purple-600 shadow-indigo-500/40' 
                }`}
            >
              {estaCorriendo ? <FaStop size={24} /> : <FaPlay size={24} className="ml-1" />}
            </Button>

            <div className="w-14" /> 
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemporizadorView;