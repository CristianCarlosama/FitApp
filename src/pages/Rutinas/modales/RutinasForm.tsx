import React, { useState, useEffect } from "react";
import { createRutina, updateRutina } from "../../../services/rutinas";
import SelectorEjercicios from "../SelectorEjercicios";

interface Props {
  rutina?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const RutinaForm: React.FC<Props> = ({
  rutina,
  onClose,
  onSuccess,
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dificultad, setDificultad] = useState("");
  const [duracion, setDuracion] = useState<number | "">("");
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [openSelector, setOpenSelector] = useState(false);

  useEffect(() => {
    if (rutina) {
      setNombre(rutina.nombre);
      setDescripcion(rutina.descripcion || "");
      setDificultad(rutina.dificultad || "");
      setDuracion(rutina.duracion || "");
      
      setEjercicios(
        (rutina.ejercicios || []).map((ej: any) => ({
          ...ej,
          // Usamos 'id' si viene directo, o 'ejercicio_id' si viene de la pivote
          // pero lo guardamos siempre como 'id' para no confundirnos
          id: ej.id || ej.ejercicio_id, 
          series: ej.series || 3,
          repeticiones: ej.repeticiones || 10,
          descanso: ej.descanso || 60,
        }))
      );
    }
  }, [rutina]);

  const agregarEjercicio = () => {
    setOpenSelector(true);
  };

  const handleSelectEjercicio = (ej: any) => {
    // Ahora comparamos siempre contra .id
    if (ejercicios.some(e => e.id === ej.id)) return; 

    setEjercicios([
      ...ejercicios,
      {
        ...ej, // trae nombre, imagen_url, etc.
        id: ej.id, 
        series: 3,
        repeticiones: 10,
        descanso: 60,
      },
    ]);
  };

  const handleEjercicioChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const nuevos = [...ejercicios];
    nuevos[index][field] = value;
    setEjercicios(nuevos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpieza de IDs: filtramos cualquier undefined o null
    const idsFinales = ejercicios
      .map(ej => ej.id || ej.ejercicio_id)
      .filter(id => id !== undefined && id !== null);

    if (idsFinales.length === 0) {
      alert("Debes agregar al menos un ejercicio válido");
      return;
    }

    const data = {
      nombre,
      descripcion,
      dificultad,
      duracion,
      ejercicios: idsFinales, // Mandamos el array de IDs puros
    };

    console.log("Datos que van al backend:", data); // Agrega este log para estar seguro

    try {
      if (rutina) {
        await updateRutina(rutina.id, data);
      } else {
        await createRutina(data);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al guardar");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <form
          onSubmit={handleSubmit}
          className="bg-[#161925] p-8 rounded-2xl w-[500px] max-h-[90vh] overflow-y-auto flex flex-col gap-4"
        >
          <h2 className="text-xl font-black uppercase text-center">
            {rutina ? "Editar Rutina" : "Nueva Rutina"}
          </h2>

          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="bg-white/5 p-3 rounded-lg"
          />

          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="bg-white/5 p-3 rounded-lg"
          />

          <select
            value={dificultad}
            onChange={(e) => setDificultad(e.target.value)}
            required
            className="bg-white/5 p-3 rounded-lg"
          >
            <option value="">Seleccionar dificultad</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          <input
            type="number"
            placeholder="Duración (min)"
            value={duracion}
            onChange={(e) => setDuracion(Number(e.target.value))}
            className="bg-white/5 p-3 rounded-lg"
          />

          {/* EJERCICIOS */}
          <div className="flex justify-between items-center mt-4">
            <h3 className="text-sm font-bold uppercase">
              Ejercicios
            </h3>

            <button
              type="button"
              onClick={agregarEjercicio}
              className="bg-purple-600 px-4 py-2 rounded-lg text-xs font-bold"
            >
              + Agregar
            </button>
          </div>

          {ejercicios.map((ej, index) => (
            <div
              key={index}
              className="bg-black/30 p-4 rounded-xl border border-white/10 flex flex-col gap-3"
            >
              <div className="flex gap-3 items-center">
                <img
                  src={ej.imagen_url}
                  alt={ej.nombre}
                  className="h-16 w-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-bold text-sm">{ej.nombre}</h4>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {ej.descripcion}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Series"
                  value={ej.series}
                  onChange={(e) =>
                    handleEjercicioChange(
                      index,
                      "series",
                      Number(e.target.value)
                    )
                  }
                  className="bg-white/5 p-2 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Reps"
                  value={ej.repeticiones}
                  onChange={(e) =>
                    handleEjercicioChange(
                      index,
                      "repeticiones",
                      Number(e.target.value)
                    )
                  }
                  className="bg-white/5 p-2 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Descanso"
                  value={ej.descanso}
                  onChange={(e) =>
                    handleEjercicioChange(
                      index,
                      "descanso",
                      Number(e.target.value)
                    )
                  }
                  className="bg-white/5 p-2 rounded-lg"
                />
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-purple-600 px-6 py-2 rounded-lg font-bold"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>

      <SelectorEjercicios
        isOpen={openSelector}
        onClose={() => setOpenSelector(false)}
        onSelect={(ej) => {
          handleSelectEjercicio(ej);
          setOpenSelector(false);
        }}
      />
    </>
  );
};

export default RutinaForm;