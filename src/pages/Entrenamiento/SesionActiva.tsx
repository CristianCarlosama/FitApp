import React, { useState, useEffect } from "react";
import { 
  FaTrash, 
  FaCheck, 
  FaClock, 
  FaDumbbell, 
  FaTimes,
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
  rpe?: number; 
}

interface Props {
  rutina: any;
  onClose: () => void;
  onFinish: (data: any) => void;
}

const SesionActiva: React.FC<Props> = ({ rutina, onClose, onFinish }) => {
  const [series, setSeries] = useState<Serie[]>([]);
  const [segundos, setSegundos] = useState(0);
  const [startTime] = useState(new Date());

  const [modal, setModal] = useState({
    isOpen: false,
    type: "info" as NotificationType,
    title: "",
    message: "",
    onConfirm: undefined as (() => void) | undefined,
  });

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  useEffect(() => {
    const interval = setInterval(() => {
      setSegundos((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const agregarSerie = (ejercicio: any) => {
    const numSeriesActuales = series.filter(s => s.ejercicio_id === ejercicio.id).length;
    const nuevaSerie: Serie = {
      ejercicio_id: ejercicio.id,
      nombre_ejercicio: ejercicio.nombre,
      numero_serie: numSeriesActuales + 1,
      peso: 0,
      reps: 0,
    };
    setSeries([...series, nuevaSerie]);
  };

  const eliminarSerie = (ejercicioId: number, numSerie: number) => {
    const filtradas = series.filter(s => !(s.ejercicio_id === ejercicioId && s.numero_serie === numSerie));
    const actualizadas = filtradas.map(s => {
      if (s.ejercicio_id === ejercicioId) {
        const nuevoNum = filtradas.filter(f => f.ejercicio_id === ejercicioId && filtradas.indexOf(f) <= filtradas.indexOf(s)).length;
        return { ...s, numero_serie: nuevoNum };
      }
      return s;
    });
    setSeries(actualizadas);
  };

  const actualizarDato = (ejercicioId: number, numSerie: number, campo: 'peso' | 'reps', valor: string) => {
    const numValor = parseFloat(valor) || 0;
    setSeries(prev => prev.map(s => 
      (s.ejercicio_id === ejercicioId && s.numero_serie === numSerie) 
      ? { ...s, [campo]: numValor } 
      : s
    ));
  };

  const intentarCerrar = () => {
    setModal({
      isOpen: true,
      type: "warning",
      title: "¿ABANDONAR SESIÓN?",
      message: "Si sales ahora perderás el progreso de este entrenamiento. ¿Estás seguro?",
      onConfirm: onClose
    });
  };

  const finalizarEntreno = () => {
    if (series.length === 0) {
      setModal({
        isOpen: true,
        type: "error",
        title: "¡ESPERA!",
        message: "No puedes terminar sin anotar al menos una serie.",
        onConfirm: undefined
      });
      return;
    }
    
    setModal({
      isOpen: true,
      type: "success",
      title: "¿LISTO PARA GUARDAR?",
      message: "Se guardará tu progreso. ¿Confirmas que terminaste?",
      onConfirm: () => {
        const ahora = new Date();
        const formatDate = (date: Date) => date.toISOString().slice(0, 19).replace('T', ' ');

        onFinish({
          rutina_id: rutina?.id || null, 
          fecha_inicio: formatDate(startTime),
          fecha_fin: formatDate(ahora), 
          notas_sesion: `Entrenamiento de ${rutina.nombre}`,
          series: series.map(s => ({ ...s, rpe: 8 }))
        });
        closeModal();
      }
    });
  };

  return (
    /* 1. QUITAMOS 'fixed inset-0' y 'z-[9999]'. Ahora usa el flujo normal del main */
    <div className="w-full flex flex-col min-h-screen bg-transparent animate-in fade-in duration-500">
      
      {/* HEADER DE SESIÓN - Ahora relativo al contenido */}
      <header className="p-6 bg-[#161925] border-b border-white/5 flex justify-between items-center sticky top-0 z-20 md:rounded-b-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={intentarCerrar}
            className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full"
          >
            <FaTimes size={20} />
          </button>
          <div>
            <Text size="lg" weight="black" className="uppercase italic leading-none">Sesión Activa</Text>
            <Text size="xs" className="text-purple-500 font-bold uppercase tracking-widest">{rutina.nombre}</Text>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-purple-500/30">
          <FaClock className="text-purple-500 animate-pulse" size={14} />
          <span className="text-xl font-mono font-black text-white">{formatTime(segundos)}</span>
        </div>
      </header>

      {/* LISTA DE EJERCICIOS */}
      <main className="p-4 md:p-6 space-y-6 pb-40">
        {rutina.ejercicios?.map((ej: any) => (
          <section key={ej.id} className="bg-[#161925] rounded-[2rem] border border-white/5 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-purple-900/10 to-transparent">
              <div className="flex items-center gap-3">
                <FaDumbbell className="text-purple-500" size={18} />
                <Text weight="black" className="uppercase text-sm italic">{ej.nombre}</Text>
              </div>
              <button 
                onClick={() => agregarSerie(ej)}
                className="bg-white text-black text-[10px] px-3 py-1.5 rounded-lg font-black uppercase hover:bg-purple-500 hover:text-white transition-all"
              >
                + Serie
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-4 gap-2 text-center">
                <Text size="xs" weight="black" className="text-gray-600 uppercase">Set</Text>
                <Text size="xs" weight="black" className="text-gray-600 uppercase">Peso</Text>
                <Text size="xs" weight="black" className="text-gray-600 uppercase">Reps</Text>
                <div />
              </div>

              {series.filter(s => s.ejercicio_id === ej.id).map((serie, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2 items-center bg-black/20 p-2 rounded-xl border border-white/5">
                  <div className="flex justify-center">
                    <span className="w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center font-black text-[10px] italic">
                      {serie.numero_serie}
                    </span>
                  </div>
                  <input 
                    type="number" 
                    className="bg-[#0f111a] border border-white/10 rounded-lg py-2 text-center text-sm font-bold outline-none focus:border-purple-500 w-full"
                    onChange={(e) => actualizarDato(ej.id, serie.numero_serie, 'peso', e.target.value)}
                  />
                  <input 
                    type="number" 
                    className="bg-[#0f111a] border border-white/10 rounded-lg py-2 text-center text-sm font-bold outline-none focus:border-purple-500 w-full"
                    onChange={(e) => actualizarDato(ej.id, serie.numero_serie, 'reps', e.target.value)}
                  />
                  <button onClick={() => eliminarSerie(ej.id, serie.numero_serie)} className="flex justify-center text-gray-700 hover:text-red-500">
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* BOTÓN FINALIZAR - Se queda dentro del flujo pero visible */}
      <div className="p-6 mt-auto">
        <button 
          onClick={finalizarEntreno}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all"
        >
          <FaCheck className="inline mr-2" /> Finalizar y Guardar
        </button>
      </div>

      <NotificationModal 
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
      />
    </div>
  );
};

export default SesionActiva;