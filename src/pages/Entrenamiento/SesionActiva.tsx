import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 🔹 Hooks necesarios
import { 
  FaTrash, FaCheck, FaDumbbell, FaTimes, FaClock, FaPlus, FaSearch
} from "react-icons/fa";
import Text from "../../components/Texts";
import Button from "../../components/Buttons"; 
import NotificationModal from "../../components/NotificationModal";
import SelectorEjercicios from "../Rutinas/SelectorEjercicios";
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
  rutina?: any; 
  onClose?: () => void;
  onFinish?: (data: any) => void;
}

const SesionActiva: React.FC<Props> = ({ rutina: propRutina, onClose: propOnClose, onFinish: propOnFinish }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const rutina = propRutina || location.state?.rutina;
  
  const [series, setSeries] = useState<Serie[]>([]);
  const [ejerciciosExtras, setEjerciciosExtras] = useState<any[]>([]);
  const [segundos, setSegundos] = useState(0);
  const [descansoActivo, setDescansoActivo] = useState(false);
  const [segundosDescanso, setSegundosDescanso] = useState(0);
  const [tiempoDescansoObjetivo, setTiempoDescansoObjetivo] = useState(90);
  const [showSelector, setShowSelector] = useState(false);
  
  const [fechaInicio] = useState(new Date().toISOString().slice(0, 19).replace('T', ' '));
  
  const [modal, setModal] = useState({
    isOpen: false,
    type: "info" as NotificationType,
    title: "",
    message: "",
    onConfirm: undefined as (() => void) | undefined,
  });

  useEffect(() => {
    if (!rutina) {
      navigate("/rutinas"); 
    }
  }, [rutina, navigate]);

  useEffect(() => {
    if (rutina?.ejercicios && series.length === 0) {
      const seriesIniciales: Serie[] = [];
      rutina.ejercicios.forEach((ej: any) => {
        const numSeries = parseInt(ej.pivot?.series || ej.series_sugeridas || ej.series || 1);
        const numReps = parseInt(ej.pivot?.repeticiones || ej.reps_sugeridas || ej.repeticiones || ej.reps || 0);

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

  const handleAddEjercicioExtra = (ejercicio: any) => {
    if (series.some(s => s.ejercicio_id === ejercicio.id)) {
      setShowSelector(false);
      return;
    }
    setEjerciciosExtras(prev => [...prev, ejercicio]);
    setSeries(prev => [...prev, {
      ejercicio_id: ejercicio.id,
      nombre_ejercicio: ejercicio.nombre,
      numero_serie: 1,
      peso: 0,
      reps: 10,
      completada: false
    }]);
    setShowSelector(false);
  };

  const handleCloseAttempt = () => {
    setModal({
      isOpen: true,
      type: "warning",
      title: "¿Abandonar sesión?",
      message: "Si sales ahora, perderás todo el progreso de este entrenamiento. ¿Estás seguro?",
      onConfirm: () => {
        if (propOnClose) propOnClose();
        else navigate(-1);
        setModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const toggleCompletarSerie = (ejercicioId: number, numSerie: number, nombreEj: string, ej: any) => {
    const tiempoDescanso = parseInt(ej.descanso || ej.pivot?.descanso || ej.descanso_sugerido || 60);

    setSeries(prev => prev.map(s => {
      if (s.ejercicio_id === ejercicioId && s.numero_serie === numSerie) {
        const nuevoEstado = !s.completada;
        if (nuevoEstado) {
          setModal({
            isOpen: true,
            type: "success",
            title: "¡Serie Completada!",
            message: `Descanso de ${tiempoDescanso}s para ${nombreEj}.`,
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
      (s.ejercicio_id === ejercicioId && s.numero_serie === numSerie) ? { ...s, [campo]: numValor } : s
    ));
  };

  const eliminarSerie = (ejercicioId: number, numSerie: number) => {
    setSeries(prev => prev.filter(s => !(s.ejercicio_id === ejercicioId && s.numero_serie === numSerie)));
  };

  const handleFinalizarEntrenamiento = async () => {
    const seriesParaGuardar = series.filter(s => s.completada);
    if (seriesParaGuardar.length === 0) {
      setModal({
        isOpen: true, type: "info", title: "¡AVISO!",
        message: "Marca al menos una serie completada.",
        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
      });
      return;
    }

    const dataFinal = {
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
    };

    if (propOnFinish) {
      propOnFinish(dataFinal);
    } else {
      // Si se accede por ruta directamente
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/entrenamientos`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(dataFinal)
        });
        if (response.ok) navigate('/');
      } catch (e) {
        console.error("Error al guardar:", e);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f111a] p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
          <FaTimes size={40} />
        </div>
        <Text size="xl" weight="black" className="uppercase italic mb-2">Sesión cerrada</Text>
        <Text size="sm" className="text-gray-400 mb-8 max-w-xs">
          Tu sesión ha expirado o no has iniciado sesión. Debes entrar para poder registrar tus entrenamientos.
        </Text>
        <div className="flex gap-4">
          <Button variant="primary" className="px-10 !rounded-full" onClick={() => navigate('/')}>
            Inicio
          </Button>
          <Button variant="primary" className="px-10 !rounded-full" onClick={() => navigate('/', { state: { openLogin: true } })}>
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  if (!rutina) return null;

  const todosLosEjercicios = [...(rutina.ejercicios || []), ...ejerciciosExtras];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#0f111a] text-white">
      <header className="p-2 bg-[#161925]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Button variant="glass" size="sm" onClick={handleCloseAttempt} className="!p-2 rounded-full h-10 w-10">
              <FaTimes />
            </Button>
            <div>
              <Text size="xs" weight="black" className="uppercase tracking-tighter text-purple-500 mb-[-4px]">En progreso</Text>
              <Text size="sm" weight="black" className="uppercase italic">{rutina.nombre || "Rutina Libre"}</Text>
            </div>
          </div>
          <div className="bg-black/60 px-4 py-2 rounded-2xl border border-purple-500/20 flex flex-col items-center">
            <Text size="xs" className="text-gray-500 font-bold leading-none mb-1">TIEMPO</Text>
            <span className="text-xl font-mono font-black text-white leading-none">{formatTime(segundos)}</span>
          </div>
        </div>

        {descansoActivo && (
          <div className={`flex items-center justify-between px-4 py-3 rounded-2xl animate-in fade-in zoom-in duration-300 ${segundosDescanso >= tiempoDescansoObjetivo ? 'bg-green-500/20 border border-green-500/50' : 'bg-blue-500/10 border border-blue-500/30'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${segundosDescanso >= tiempoDescansoObjetivo ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}>
                <FaClock size={14} />
              </div>
              <div>
                <Text size="xs" weight="black" className="uppercase">{segundosDescanso >= tiempoDescansoObjetivo ? "¡LISTO!" : "DESCANSO"}</Text>
                <Text size="xs" className="text-white/40">Meta: {formatTime(tiempoDescansoObjetivo)}</Text>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-mono font-black">{formatTime(segundosDescanso)}</span>
              <Button variant="secondary" size="sm" onClick={() => setDescansoActivo(false)}>
                Omitir
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="p-4 space-y-8 pb-48">
        {todosLosEjercicios.map((ej: any) => (
          <section key={ej.id} className="bg-[#161925] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl">
            <div className="p-5 bg-gradient-to-r from-white/5 to-transparent flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-500">
                  <FaDumbbell size={20} />
                </div>
                <Text weight="black" size="sm" className="uppercase italic tracking-tight">{ej.nombre}</Text>
              </div>
              <Button 
                variant="glass" size="sm" className="!p-2 rounded-full w-8 h-8"
                onClick={() => {
                  const numSeriesActuales = series.filter(s => s.ejercicio_id === ej.id).length;
                  setSeries(prev => [...prev, {
                    ejercicio_id: ej.id, nombre_ejercicio: ej.nombre,
                    numero_serie: numSeriesActuales + 1, peso: 0, reps: 10, completada: false
                  }]);
                }}
              >
                <FaPlus size={10} />
              </Button>
            </div>

            <div className="p-5 pt-0 space-y-3">
              {series.filter(s => s.ejercicio_id === ej.id).map((serie, idx) => (
                <div key={`${ej.id}-${idx}`} className={`grid grid-cols-5 gap-2 items-center p-2 rounded-2xl transition-all ${serie.completada ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/[0.02] border border-transparent'}`}>
                  <div className="h-11 flex items-center justify-center rounded-xl bg-black/20 text-xs font-black text-gray-500">{serie.numero_serie}</div>
                  <input type="number" placeholder="0" className="bg-[#0f111a] border border-white/5 rounded-xl h-11 text-center text-sm font-bold outline-none" onChange={(e) => actualizarDato(ej.id, serie.numero_serie, 'peso', e.target.value)} />
                  <input type="number" defaultValue={serie.reps} className="bg-[#0f111a] border border-white/5 rounded-xl h-11 text-center text-sm font-bold outline-none" onChange={(e) => actualizarDato(ej.id, serie.numero_serie, 'reps', e.target.value)} />
                  <button onClick={() => toggleCompletarSerie(ej.id, serie.numero_serie, ej.nombre, ej)} className={`h-11 rounded-xl flex items-center justify-center transition-all ${serie.completada ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-600'}`}>
                    <FaCheck size={14} />
                  </button>
                  <button onClick={() => eliminarSerie(ej.id, serie.numero_serie)} className="flex justify-center text-red-900/40 hover:text-red-500 transition-colors">
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
        <Button variant="outline" className="w-full !py-8 !rounded-[2.5rem] flex-col gap-3 border-dashed opacity-60 hover:opacity-100" onClick={() => setShowSelector(true)}>
          <FaSearch size={18} className="text-purple-500" />
          <Text size="xs" weight="black" className="uppercase tracking-widest">Añadir ejercicio extra</Text>
        </Button>
      </main>

      <footer className="p-2 bg-[#0f111a]/80 backdrop-blur-2xl fixed bottom-0 w-full border-t border-white/5 z-40">
        <div className="max-w-md mx-auto space-y-4">
          <Button variant="primary" size="lg" className="w-full !py-5 !rounded-[2rem] uppercase font-black" onClick={handleFinalizarEntrenamiento}>
            Finalizar Entrenamiento
          </Button>
        </div>
      </footer>

      {showSelector && <SelectorEjercicios isOpen={showSelector} onClose={() => setShowSelector(false)} onSelect={handleAddEjercicioExtra} />}
      <NotificationModal isOpen={modal.isOpen} type={modal.type} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onClose={() => setModal({...modal, isOpen: false})} />
    </div>
  );
};

export default SesionActiva;