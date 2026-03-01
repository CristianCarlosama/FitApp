import React, { useState, useEffect } from "react";
import { 
  FaTrash, FaCheck, FaDumbbell, FaTimes, FaClock
} from "react-icons/fa";
import Text from "../../components/Texts";
import NotificationModal from "../../components/NotificationModal";
import type { NotificationType } from "../../components/NotificationModal";

interface Serie {
  ejercicio_id: number;
  nombre_ejercicio: string;
  numero_serie: number;
  peso: number;
  reps: number;
  completada: boolean;
}

interface Props {
  rutina: any; 
  onClose: () => void;
  onFinish: (data: any) => void;
}

const SesionActiva: React.FC<Props> = ({ rutina, onClose, onFinish }) => {
  const [series, setSeries] = useState<Serie[]>([]);
  const [segundos, setSegundos] = useState(0);
  const [descansoActivo, setDescansoActivo] = useState(false);
  const [segundosDescanso, setSegundosDescanso] = useState(0);
  const [tiempoDescansoObjetivo, setTiempoDescansoObjetivo] = useState(90);
  
  // Formato compatible con MySQL: YYYY-MM-DD HH:mm:ss
  const [fechaInicio] = useState(new Date().toISOString().slice(0, 19).replace('T', ' '));
  
  const [modal, setModal] = useState({
    isOpen: false,
    type: "info" as NotificationType,
    title: "",
    message: "",
    onConfirm: undefined as (() => void) | undefined,
  });

  // --- CARGA DE DATOS ---
  useEffect(() => {
    if (rutina?.ejercicios) {
      const seriesIniciales: Serie[] = [];
      
      rutina.ejercicios.forEach((ej: any) => {
        const numSeries = parseInt(
          ej.pivot?.series || 
          ej.series_sugeridas || 
          ej.series || 
          1
        );
        
        const numReps = parseInt(
          ej.pivot?.repeticiones || 
          ej.reps_sugeridas || 
          ej.repeticiones || 
          ej.reps || 
          0
        );

        for (let i = 1; i <= numSeries; i++) {
          seriesIniciales.push({
            ejercicio_id: ej.id,
            nombre_ejercicio: ej.nombre,
            numero_serie: i,
            peso: 0,
            reps: numReps,
            completada: false
          });
        }
      });
      setSeries(seriesIniciales);
    }
  }, [rutina]);

  // --- Cronómetros ---
  useEffect(() => {
    const interval = setInterval(() => {
      setSegundos((s) => s + 1);
      if (descansoActivo) setSegundosDescanso((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [descansoActivo]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleCloseAttempt = () => {
    setModal({
      isOpen: true,
      type: "warning",
      title: "¿Abandonar sesión?",
      message: "Si sales ahora, perderás todo el progreso de este entrenamiento. ¿Estás seguro?",
      onConfirm: () => {
        onClose();
        setModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // --- MANEJO DE COMPLETADO Y DESCANSO ---
  const toggleCompletarSerie = (ejercicioId: number, numSerie: number, nombreEj: string, descansoSugerido: any) => {
    const tiempoDescanso = parseInt(descansoSugerido || 60);

    setSeries(prev => prev.map(s => {
      if (s.ejercicio_id === ejercicioId && s.numero_serie === numSerie) {
        const nuevoEstado = !s.completada;
        
        if (nuevoEstado) {
          setModal({
            isOpen: true,
            type: "success",
            title: "¡Serie Completada!",
            message: `Vas a iniciar un descanso de ${tiempoDescanso} segundos para ${nombreEj}. ¿DALE?`,
            onConfirm: () => {
              setTiempoDescansoObjetivo(tiempoDescanso);
              setSegundosDescanso(0);
              setDescansoActivo(true);
              setModal(prev => ({ ...prev, isOpen: false }));
            }
          });
        }
        return { ...s, completada: nuevoEstado };
      }
      return s;
    }));
  };

  const actualizarDato = (ejercicioId: number, numSerie: number, campo: 'peso' | 'reps', valor: string) => {
    const numValor = parseFloat(valor) || 0;
    setSeries(prev => prev.map(s => 
      (s.ejercicio_id === ejercicioId && s.numero_serie === numSerie) 
      ? { ...s, [campo]: numValor } 
      : s
    ));
  };

  const eliminarSerie = (ejercicioId: number, numSerie: number) => {
    setSeries(prev => prev.filter(s => !(s.ejercicio_id === ejercicioId && s.numero_serie === numSerie)));
  };

  // --- FUNCIÓN FINALIZAR (SÓLO GUARDAR MARCADAS) ---
  const handleFinalizarEntrenamiento = () => {
    // 1. Filtrar solo las series que tienen el CHECK marcado
    const seriesParaGuardar = series.filter(s => s.completada);

    // 2. Validar que al menos haya una serie hecha
    if (seriesParaGuardar.length === 0) {
      setModal({
        isOpen: true,
        type: "info",
        title: "¡AVISO!",
        message: "Pana, no has marcado ninguna serie con el CHECK. Debes marcar las series que completaste para poder guardarlas.",
        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
      });
      return;
    }

    // 3. Enviar datos al Backend
    onFinish({
      rutina_id: rutina.id,
      fecha_inicio: fechaInicio,
      fecha_fin: new Date().toISOString().slice(0, 19).replace('T', ' '),
      notas_sesion: "",
      series: seriesParaGuardar.map(s => ({
        ejercicio_id: s.ejercicio_id,
        peso: Number(s.peso),
        reps: Number(s.reps),
        numero_serie: s.numero_serie
      }))
    });
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#0f111a]">
      <header className="p-4 bg-[#161925] border-b border-white/5 sticky top-0 z-30 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <button onClick={handleCloseAttempt} className="text-gray-500 hover:text-white transition-colors">
              <FaTimes size={18}/>
            </button>
            <Text size="sm" weight="black" className="uppercase italic text-purple-500">Sesión Activa</Text>
          </div>
          <div className="bg-black/40 px-3 py-1 rounded-xl border border-purple-500/30 text-center min-w-[100px]">
            <Text size="xs" className="text-purple-500 block">TIEMPO TOTAL</Text>
            <span className="text-lg font-mono font-black text-white">{formatTime(segundos)}</span>
          </div>
        </div>

        {descansoActivo && (
          <div className={`flex items-center justify-between px-4 py-3 rounded-2xl animate-in slide-in-from-top duration-300 ${segundosDescanso >= tiempoDescansoObjetivo ? 'bg-green-600/20 border border-green-500' : 'bg-blue-600/20 border border-blue-500/50'}`}>
            <div className="flex items-center gap-3 text-white">
              <FaClock className={segundosDescanso >= tiempoDescansoObjetivo ? 'animate-bounce text-green-400' : 'text-blue-400'} />
              <div>
                <Text size="xs" weight="black" className="uppercase">
                  {segundosDescanso >= tiempoDescansoObjetivo ? "¡DALE A LA OTRA!" : "DESCANSANDO"}
                </Text>
                <Text size="xs" className="text-white/60">Objetivo: {formatTime(tiempoDescansoObjetivo)}</Text>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-mono font-black text-white">{formatTime(segundosDescanso)}</span>
              <button onClick={() => setDescansoActivo(false)} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-[10px] font-bold uppercase text-white transition-colors">Omitir</button>
            </div>
          </div>
        )}
      </header>

      <main className="p-4 space-y-6 pb-40">
        {rutina.ejercicios?.map((ej: any) => (
          <section key={ej.id} className="bg-[#161925] rounded-[2rem] border border-white/5 overflow-hidden shadow-inner">
            <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FaDumbbell className="text-purple-500" />
                <Text weight="black" size="sm" className="uppercase italic text-white">{ej.nombre}</Text>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-5 gap-2 px-1">
                <Text size="xs" className="text-gray-600 font-bold">SERIE</Text>
                <Text size="xs" className="text-gray-600 font-bold text-center">PESO</Text>
                <Text size="xs" className="text-gray-600 font-bold text-center">REPS</Text>
                <Text size="xs" className="text-gray-600 font-bold text-center">CHECK</Text>
                <Text size="xs" className="text-gray-600 font-bold"> </Text>
              </div>

              {series.filter(s => s.ejercicio_id === ej.id).map((serie, idx) => (
                <div key={`${ej.id}-${idx}`} className={`grid grid-cols-5 gap-2 items-center p-1 rounded-xl transition-all ${serie.completada ? 'bg-green-500/10' : 'opacity-70'}`}>
                  <div className="bg-white/5 h-10 flex items-center justify-center rounded-xl text-xs font-black text-gray-400">
                    {serie.numero_serie}
                  </div>
                  
                  <input 
                    type="number" 
                    placeholder="0"
                    className="bg-[#0f111a] border border-white/5 rounded-xl h-10 text-center text-sm font-bold text-white outline-none focus:border-purple-500" 
                    onChange={(e) => actualizarDato(ej.id, serie.numero_serie, 'peso', e.target.value)} 
                  />
                  
                  <input 
                    key={`reps-${ej.id}-${serie.numero_serie}`}
                    type="number" 
                    defaultValue={serie.reps}
                    className="bg-[#0f111a] border border-white/5 rounded-xl h-10 text-center text-sm font-bold text-white outline-none focus:border-purple-500" 
                    onChange={(e) => actualizarDato(ej.id, serie.numero_serie, 'reps', e.target.value)} 
                  />

                  <button 
                    onClick={() => toggleCompletarSerie(ej.id, serie.numero_serie, ej.nombre, ej.descanso_sugerido)}
                    className={`h-10 rounded-xl flex items-center justify-center transition-all ${serie.completada ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-white/5 text-gray-700 hover:bg-white/10'}`}
                  >
                    <FaCheck size={14} />
                  </button>

                  <button 
                    onClick={() => eliminarSerie(ej.id, serie.numero_serie)}
                    className="flex justify-center text-gray-800 hover:text-red-500"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="p-4 bg-[#0f111a]/95 backdrop-blur-xl fixed bottom-0 w-full border-t border-white/5 z-40">
        <div className="max-w-md mx-auto">
          <Text size="xs" className="text-center text-gray-500 italic block mb-3">
             Se guardarán solo las series con el check <FaCheck className="inline text-green-500 ml-1" />
          </Text>
          <button 
            onClick={handleFinalizarEntrenamiento} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(147,51,234,0.3)] active:scale-95 transition-all"
          >
            Finalizar Entrenamiento
          </button>
        </div>
      </footer>

      <NotificationModal 
        isOpen={modal.isOpen} 
        type={modal.type} 
        title={modal.title} 
        message={modal.message} 
        onConfirm={modal.onConfirm} 
        onClose={() => setModal({...modal, isOpen: false})} 
      />
    </div>
  );
};

export default SesionActiva;