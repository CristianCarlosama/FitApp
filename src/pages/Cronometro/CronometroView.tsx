import React, { useState, useEffect, useRef } from "react";
import { 
  FaPlay, FaStop, FaHistory, 
  FaUndo, FaClock, FaChevronLeft 
} from "react-icons/fa";

// --- COMPONENTES REUTILIZABLES ---
import Text from "../../components/Texts";
import Button from "../../components/Buttons";

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
  
  // Sincronizado con el giro visual de 60s
  const progreso = ((tiempo % 60000) / 60000) * circunferencia;

  const iniciarCronometro = () => {
    if (estaCorriendo) return;
    setEstaCorriendo(true);
    idIntervalo.current = setInterval(() => {
      setTiempo((t) => t + 1000);
    }, 1000);
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
    const nuevaVuelta: Lap = { id: vueltas.length + 1, time: tiempo };
    setVueltas([nuevaVuelta, ...vueltas]);
  };

  const formatearTiempo = (ms: number) => {
    const totalSegundos = Math.floor(ms / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => { if (idIntervalo.current) clearInterval(idIntervalo.current); };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0f111a] font-sans">
      
      {/* HEADER STICKY */}
      <header className="sticky top-0 z-40 bg-[#0f111a]/95 backdrop-blur-xl border-b border-white/5 p-4 md:p-6">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button onClick={goBack} className="group flex items-center gap-3 active:scale-95 transition-all w-fit">
              <FaChevronLeft className="text-purple-500" />
              <div className="flex flex-col items-start">
                <Text size="xl" weight="black" variant="gradient" className="uppercase tracking-tighter leading-none italic">ARES</Text>
                <Text size="xs" className="text-gray-500 font-bold tracking-widest uppercase italic">Utilidades / Cronómetro</Text>
              </div>
            </button>
            <div className="p-3 bg-purple-600/10 rounded-2xl border border-purple-500/20">
              <FaClock className="text-purple-500" />
            </div>
          </div>
        </div>
      </header>

      {/* ÁREA DEL RELOJ */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 gap-12 overflow-hidden">
        
        <div className="flex flex-col items-center gap-2">
            <Text size="xs" weight="black" className="uppercase tracking-[0.4em] text-purple-500/60 italic">
                Sesión de Tiempo
            </Text>
        </div>

        {/* CÍRCULO - MISMO TAMAÑO QUE EL TEMPORIZADOR */}
        <div className="relative flex items-center justify-center w-64 h-64 md:w-72 md:h-72 my-2">
          {/* Glow de fondo dinámico */}
          <div className={`absolute inset-0 rounded-full blur-[80px] transition-all duration-1000 ${
            estaCorriendo ? 'bg-indigo-600/20 shadow-[0_0_100px_rgba(99,102,241,0.2)]' : 'bg-purple-600/5'
          }`}></div>

          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 300 300">
            {/* Círculo base fondo */}
            <circle cx="150" cy="150" r={radio} fill="transparent" stroke="#161926" strokeWidth="8" />
            
            {/* Anillo de progreso sólido */}
            <circle
              cx="150" cy="150" r={radio} fill="transparent"
              stroke="url(#timerGradient)" 
              strokeWidth="12"
              strokeDasharray={circunferencia}
              strokeDashoffset={circunferencia - progreso}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear shadow-lg"
            />

            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative z-10 flex flex-col items-center">
            {/* NÚMEROS - MISMO TAMAÑO QUE EL TEMPORIZADOR */}
            <span className="text-6xl md:text-7xl font-black tracking-tighter text-white tabular-nums drop-shadow-2xl">
              {formatearTiempo(tiempo)}
            </span>
          </div>
        </div>

        {/* CONTROLES */}
        <div className="flex items-center gap-8 z-50">
          <Button variant="glass" onClick={reiniciarCronometro} className="!w-14 !h-14 !p-0 !rounded-3xl !bg-white/[0.03] !border-white/5 shadow-inner flex items-center justify-center">
            <FaUndo className="text-gray-400" />
          </Button>

          <Button 
            variant="primary" 
            onClick={estaCorriendo ? pausarCronometro : iniciarCronometro}
            className={`!w-24 !h-24 !rounded-[2.5rem] !p-0 shadow-2xl transition-all duration-500 active:scale-90 
              ${estaCorriendo 
                ? 'from-orange-600 to-red-600 shadow-red-500/40 rotate-180' 
                : 'from-blue-500 via-indigo-500 to-purple-600 shadow-indigo-500/40' 
              }`}
          >
            {estaCorriendo ? <FaStop size={24} /> : <FaPlay size={24} className="ml-1" />}
          </Button>

          <Button 
            variant="glass" 
            onClick={registrarVuelta} 
            disabled={!estaCorriendo}
            className={`!w-14 !h-14 !p-0 !rounded-3xl !bg-white/[0.03] !border-white/5 flex items-center justify-center ${!estaCorriendo && 'opacity-20'}`}
          >
            <FaHistory className="text-gray-400" />
          </Button>
        </div>

        {/* LISTA DE VUELTAS */}
        <div className="w-full max-w-sm h-40 overflow-y-auto no-scrollbar bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-5">
            {vueltas.length > 0 ? (
                vueltas.map((vuelta) => (
                    <div key={vuelta.id} className="flex justify-between items-center py-3 px-2 border-b border-white/5 last:border-none animate-in fade-in slide-in-from-bottom-2">
                        <Text size="xs" weight="black" className="text-gray-600 uppercase italic">Lap {vuelta.id.toString().padStart(2, '0')}</Text>
                        <Text weight="black" className="text-white font-mono">{formatearTiempo(vuelta.time)}</Text>
                    </div>
                ))
            ) : (
                <div className="h-full flex items-center justify-center opacity-20">
                    <Text size="xs" weight="black" className="uppercase italic tracking-[0.2em]">Historial Libre</Text>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default CronometroView;