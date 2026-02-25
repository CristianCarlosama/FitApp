import React, { useState, useEffect } from "react";
import { createRutina, updateRutina } from "../../../services/rutinas";
import SelectorEjercicios from "../SelectorEjercicios";
import Text from "../../../components/Texts";
import NotificationModal from "../../../components/NotificationModal"; 
import { FaTrash, FaPlus, FaLock, FaGlobeAmericas } from "react-icons/fa";

interface Props {
  rutina?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const RutinaForm: React.FC<Props> = ({ rutina, onClose, onSuccess }) => {
  // Verificamos si la rutina es propia (si no viene rutina, estamos creando, así que es propia)
  const esMia = rutina ? (rutina.es_mia ?? true) : true;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dificultad, setDificultad] = useState("");
  const [duracion, setDuracion] = useState<number | "">("");
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [openSelector, setOpenSelector] = useState(false);

  const [esPublica, setEsPublica] = useState(false);
  const [accesos, setAccesos] = useState<number[]>([]); // IDs de amigos
  const [friends, setFriends] = useState<any[]>([]); // lista de amigos

  const [notif, setNotif] = useState<{ open: boolean; title: string; message: string; type: 'success' | 'error' }>({
    open: false,
    title: "",
    message: "",
    type: "success"
  });

  useEffect(() => {
    if (rutina) {
      setNombre(rutina.nombre);
      setDescripcion(rutina.descripcion || "");
      setDificultad(rutina.dificultad || "");
      setDuracion(rutina.duracion || "");
      setEjercicios(
        (rutina.ejercicios || []).map((ej: any) => ({
          ...ej,
          id: ej.id || ej.ejercicio_id,
          series: ej.series || 3,
          repeticiones: ej.repeticiones || 10,
          descanso: ej.descanso || 60,
        }))
      );
      setEsPublica(rutina.es_publica || false);
      setAccesos(rutina.accesos?.map((u: any) => u.id) || []);
    }
  }, [rutina]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("/api/friends");
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.log("No se pudieron cargar los amigos", err);
      }
    };
    fetchFriends();
  }, []);

  const handleSelectEjercicio = (ej: any) => {
    if (ejercicios.some((e) => e.id === ej.id)) return;
    setEjercicios([...ejercicios, { ...ej, id: ej.id, series: 3, repeticiones: 10, descanso: 60 }]);
  };

  const handleEjercicioChange = (index: number, field: string, value: any) => {
    const nuevos = [...ejercicios];
    nuevos[index][field] = value;
    setEjercicios(nuevos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!esMia) return;

    const idsFinales = ejercicios.map((ej) => ej.id).filter(id => id);
    if (idsFinales.length === 0) {
      setNotif({ open: true, title: "Ojo ahí", message: "Añade al menos un ejercicio, pana.", type: "error" });
      return;
    }

    const data = {
      nombre,
      descripcion,
      dificultad,
      duracion,
      ejercicios: idsFinales,
      es_publica: esPublica,
      accesos,
    };

    try {
      if (rutina) {
        await updateRutina(rutina.id, data);
        setNotif({ open: true, title: "¡Éxito!", message: "Rutina actualizada correctamente.", type: "success" });
      } else {
        await createRutina(data);
        setNotif({ open: true, title: "¡Éxito!", message: "Nueva rutina creada. ¡A darle!", type: "success" });
      }
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setNotif({ open: true, title: "Error", message: "Algo salió mal al guardar la rutina.", type: "error" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#161925] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide">
        
        <Text size="2xl" weight="black" variant="gradient" className="uppercase text-center mb-6">
          {rutina ? (esMia ? "Editar Rutina" : "Detalles de Rutina") : "Nueva Rutina"}
        </Text>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bloqueamos todos los inputs si la rutina no es nuestra */}
          <fieldset disabled={!esMia} className="space-y-4 contents">
            <input
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all text-white disabled:opacity-50"
              placeholder="Nombre de la Rutina"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <select
              className="w-full bg-[#161925] border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all text-gray-400 disabled:opacity-50"
              value={dificultad}
              onChange={(e) => setDificultad(e.target.value)}
              required
            >
              <option value="">Seleccionar Dificultad</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>

            <input
              type="number"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all text-white disabled:opacity-50"
              placeholder="Duración aprox (min)"
              value={duracion}
              onChange={(e) => setDuracion(Number(e.target.value))}
            />

            <textarea
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all h-24 resize-none text-white disabled:opacity-50"
              placeholder="Descripción de la rutina"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />

            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-4">
                <Text size="sm" weight="black" className="uppercase text-gray-400">Ejercicios</Text>
                {esMia && (
                  <button
                    type="button"
                    onClick={() => setOpenSelector(true)}
                    className="bg-purple-600/20 text-purple-400 p-2 rounded-xl hover:bg-purple-600 hover:text-white transition-all"
                  >
                    <FaPlus size={12} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {ejercicios.map((ej, index) => (
                  <div key={index} className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase text-purple-400">{ej.nombre}</span>
                      {esMia && (
                        <button 
                          type="button"
                          onClick={() => setEjercicios(ejercicios.filter((_, i) => i !== index))}
                          className="text-gray-600 hover:text-red-500"
                        >
                          <FaTrash size={12} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] uppercase text-gray-500 ml-1">Series</span>
                        <input
                          type="number"
                          className="bg-black/40 p-2 rounded-lg text-xs text-center outline-none border border-white/5 focus:border-purple-500 text-white"
                          value={ej.series}
                          onChange={(e) => handleEjercicioChange(index, "series", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] uppercase text-gray-500 ml-1">Reps</span>
                        <input
                          type="number"
                          className="bg-black/40 p-2 rounded-lg text-xs text-center outline-none border border-white/5 focus:border-purple-500 text-white"
                          value={ej.repeticiones}
                          onChange={(e) => handleEjercicioChange(index, "repeticiones", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] uppercase text-gray-500 ml-1">Descanso (s)</span>
                        <input
                          type="number"
                          className="bg-black/40 p-2 rounded-lg text-xs text-center outline-none border border-white/5 focus:border-purple-500 text-white"
                          value={ej.descanso}
                          onChange={(e) => handleEjercicioChange(index, "descanso", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </fieldset>

          {/* --- SECCIÓN DE PRIVACIDAD ESTILIZADA --- */}
          {esMia && (
            <div className="pt-4 border-t border-white/10 space-y-4"> {/* Bajamos pt-6 a pt-4 y space-y a 4 */}
              <div 
                className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer"
                onClick={() => setEsPublica(!esPublica)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${esPublica ? 'bg-purple-600/20 text-purple-400' : 'bg-gray-800 text-gray-500'}`}>
                    {esPublica ? <FaGlobeAmericas size={16} /> : <FaLock size={16} />}
                  </div>
                  <div className="flex flex-col">
                    <Text size="sm" weight="black" className="uppercase tracking-wide">Visibilidad</Text>
                    <Text size="xs" className="text-gray-500 font-bold uppercase tracking-tighter">
                      {esPublica ? "Pública" : "Privada"}
                    </Text>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full p-1 transition-all duration-300 ${esPublica ? 'bg-purple-600' : 'bg-gray-700'}`}>
                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transition-all duration-300 transform ${esPublica ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Solo mostramos el contenedor de amigos si NO es pública Y si hay amigos */}
              {!esPublica && friends.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1 scrollbar-hide">
                    {friends.map((f) => (
                      <label 
                        key={f.id} 
                        className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer group ${
                          accesos.includes(f.id) 
                          ? 'bg-purple-600/20 border-purple-500/50' 
                          : 'bg-white/5 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${accesos.includes(f.id) ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-gray-600'}`} />
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={accesos.includes(f.id)}
                          onChange={(e) => {
                            if (e.target.checked) setAccesos([...accesos, f.id]);
                            else setAccesos(accesos.filter((id) => id !== f.id));
                          }}
                        />
                        <span className={`text-[9px] font-black uppercase tracking-tight truncate ${accesos.includes(f.id) ? 'text-white' : 'text-gray-500'}`}>
                          {f.nombre}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* --- BOTONES DE ACCIÓN --- */}
          <div className="flex flex-col gap-3 mt-8">
            {esMia ? (
              <button
                type="submit"
                className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
              >
                {rutina ? "Actualizar Rutina" : "Guardar Rutina"}
              </button>
            ) : (
              <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-400 text-[10px] font-black uppercase text-center border border-blue-500/20 tracking-widest">
                Modo lectura: Esta rutina no es tuya.
              </div>
            )}
            
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 font-bold uppercase text-[10px] hover:text-white transition-all py-2"
            >
              {esMia ? "Cancelar" : "Cerrar"}
            </button>
          </div>
        </form>
      </div>

      <SelectorEjercicios
        isOpen={openSelector}
        onClose={() => setOpenSelector(false)}
        onSelect={handleSelectEjercicio}
      />

      <NotificationModal
        isOpen={notif.open}
        title={notif.title}
        message={notif.message}
        type={notif.type}
        onClose={() => setNotif({ ...notif, open: false })}
      />
    </div>
  );
};

export default RutinaForm;