import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaPlay, FaStop, FaHistory, FaUndo, FaCog, FaClock } from "react-icons/fa";
import Text from "../../components/Texts";
import Button from "../../components/Buttons";
import Modal from "../../components/Modal"; // El que antes era Modalitpwiwiiw

interface Lap {
  id: number;
  time: number;
}

interface CronometroViewProps {
  goBack: () => void;
}

const CronometroView: React.FC<CronometroViewProps> = ({ goBack }) => {
  // Estados de lógica
  const [tiempo, setTiempo] = useState<number>(0);
  const [estaCorriendo, setEstaCorriendo] = useState<boolean>(false);
  const [vueltas, setVueltas] = useState<Lap[]>([]);
  const [modoHITT, setModoHIIT] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Configuración HIIT (en segundos)
  const [timerConfig, setTimerConfig] = useState(60); 
  const idIntervalo = useRef<ReturnType<typeof setInterval> | null>(null);

  const radio = 135;
  const circunferencia = 2 * Math.PI * radio;
  
  // Cálculo de progreso dinámico
  const limite = modoHITT ? timerConfig * 1000 : 60000;
  const progreso = ((tiempo % limite) / limite) * circunferencia;

  const iniciarCronometro = () => {
    if (estaCorriendo) return;
    setEstaCorriendo(true);
    idIntervalo.current = setInterval(() => {
      setTiempo((t) => {
        if (modoHITT) {
          if (t <= 0) {
            pausarCronometro();
            return 0;
          }
          return t - 10;
        }
        return t + 10;
      });
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
    setTiempo(modoHITT ? timerConfig * 1000 : 0);
    setVueltas([]);
  };

  const registrarVuelta = () => {
    if (tiempo === 0 || modoHITT) return;
    const nuevaVuelta: Lap = { id: vueltas.length + 1, time: tiempo };
    setVueltas([nuevaVuelta, ...vueltas]);
  };

  const formatearTiempo = (ms: number) => {
    const totalSegundos = Math.floor(ms / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    const centisegundos = Math.floor((ms % 1000) / 10);
    return `${minutos.toString().padStart(2, '0')}:${segundos
      .toString()
      .padStart(2, '0')}.${centisegundos.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => { if (idIntervalo.current) clearInterval(idIntervalo.current); };
  }, []);

  // Cambiar modo y resetear
  const toggleModo = () => {
    pausarCronometro();
    setModoHIIT(!modoHITT);
    setTiempo(!modoHITT ? timerConfig * 1000 : 0);
    setVueltas([]);
  };

  return (
    <section className="flex flex-col h-screen p-4 bg-[#0f111a] text-white overflow-hidden">
      {/* Header con tu componente Button Glass */}
      <div className="flex justify-between items-center mb-6 z-50">
        <Button variant="glass" size="sm" onClick={goBack} className="!rounded-full">
          <FaArrowLeft className="mr-1" /> VOLVER
        </Button>
        <Button variant="glass" size="sm" onClick={toggleModo} className="uppercase tracking-widest">
          {modoHITT ? <><FaClock className="mr-2" /> Cronómetro</> : <><FaHistory className="mr-2" /> Modo HIIT</>}
        </Button>
      </div>

      <div className="flex flex-col items-center justify-start flex-grow gap-8">
        <Text weight="black" size="lg" className="italic uppercase text-purple-500 tracking-tighter">
          {modoHITT ? "Temporizador de Intervalos" : "Sesión de Tiempo"}
        </Text>
        
        {/* CONTENEDOR DEL CÍRCULO */}
        <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80">
          <div className={`absolute inset-0 rounded-full blur-[60px] transition-all duration-700 ${
            estaCorriendo ? (modoHITT ? 'bg-blue-600 opacity-20' : 'bg-purple-600 opacity-25') : 'opacity-5'
          }`}></div>

          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r={radio} fill="transparent" stroke="#1f2232" strokeWidth="6" />
            <circle
              cx="150" cy="150" r={radio} fill="transparent"
              stroke={modoHITT ? "#3b82f6" : "url(#neonGrad)"}
              strokeWidth="10"
              strokeDasharray={circunferencia}
              strokeDashoffset={modoHITT ? (circunferencia * (1 - tiempo / (timerConfig * 1000))) : (circunferencia - progreso)}
              strokeLinecap="round"
              className="transition-all duration-75 ease-linear shadow-lg"
            />
            <defs>
              <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative z-10 flex flex-col items-center">
            <span className="text-5xl md:text-6xl font-mono font-black tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              {formatearTiempo(tiempo)}
            </span>
            {modoHITT && (
               <button onClick={() => setIsModalOpen(true)} className="mt-2 text-blue-400 flex items-center gap-1 text-[10px] font-bold uppercase hover:text-white transition-colors">
                 <FaCog /> Ajustar Meta
               </button>
            )}
          </div>
        </div>

        {/* CONTROLES USANDO TU COMPONENTE BUTTON */}
        <div className="flex items-center gap-6 z-50">
          <Button variant="outline" onClick={reiniciarCronometro} className="!p-4 !rounded-full">
            <FaUndo />
          </Button>

          <Button 
            variant="primary" 
            onClick={estaCorriendo ? pausarCronometro : iniciarCronometro}
            className={`!w-24 !h-24 !rounded-full !p-0 text-2xl ${estaCorriendo ? 'from-red-600 to-orange-500 shadow-red-500/20' : ''}`}
          >
            {estaCorriendo ? <FaStop /> : <FaPlay className="ml-1" />}
          </Button>

          <Button 
            variant="outline" 
            onClick={registrarVuelta} 
            disabled={!estaCorriendo || modoHITT}
            className="!p-4 !rounded-full"
          >
            <FaHistory />
          </Button>
        </div>

        {/* LISTA DE VUELTAS O INFO HIIT */}
        <div className="w-full max-w-md flex-grow overflow-y-auto no-scrollbar mt-4 border-t border-white/5">
          {!modoHITT ? (
            vueltas.map((vuelta) => (
              <div key={vuelta.id} className="flex justify-between items-center py-4 border-b border-white/5 px-2 animate-in fade-in slide-in-from-bottom-2">
                <Text size="xs" weight="black" className="text-gray-500 uppercase tracking-widest">Vuelta {vuelta.id.toString().padStart(2, '0')}</Text>
                <Text weight="bold" className="font-mono text-purple-400">{formatearTiempo(vuelta.time)}</Text>
              </div>
            ))
          ) : (
            <div className="p-6 text-center opacity-40">
               <Text size="sm">Modo HIIT activo: El tiempo retrocederá hasta llegar a 0.</Text>
            </div>
          )}
        </div>
      </div>

      {/* MODAL PARA CONFIGURAR HIIT */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Configurar Intervalo"
      >
        <div className="flex flex-col gap-4 p-4">
          <Text className="text-center">Define cuántos segundos durará tu intervalo de trabajo:</Text>
          <input 
            type="number" 
            value={timerConfig}
            onChange={(e) => setTimerConfig(Number(e.target.value))}
            className="bg-[#0f111a] border border-white/10 p-4 rounded-xl text-center text-2xl font-black text-purple-500 outline-none focus:border-purple-500"
          />
          <Button variant="primary" onClick={() => { reiniciarCronometro(); setIsModalOpen(false); }}>
            GUARDAR CONFIGURACIÓN
          </Button>
        </div>
      </Modal>
    </section>
  );
};

export default CronometroView;