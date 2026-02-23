import React, { useEffect, useState } from "react";
import { getEjercicios, createEjercicio, deleteEjercicio } from "../../services/ejercicios";

const Ejercicios: React.FC = () => {
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [nuevoEjercicio, setNuevoEjercicio] = useState({
    nombre: "",
    clase: "",
    descripcion: "",
    series: "",
    repeticiones: "",
    descanso: "",
    video_url: "",
    foto_1: "",
    foto_2: "",
    foto_3: "",
  });

  useEffect(() => {
    fetchEjercicios();
  }, []);

  const fetchEjercicios = async () => {
    const data = await getEjercicios();
    setEjercicios(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevoEjercicio({ ...nuevoEjercicio, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!nuevoEjercicio.nombre || !nuevoEjercicio.clase) return;

    const payload = {
      ...nuevoEjercicio,
      editable: true,
      series: nuevoEjercicio.series ? parseInt(nuevoEjercicio.series) : null,
      repeticiones: nuevoEjercicio.repeticiones ? parseInt(nuevoEjercicio.repeticiones) : null,
      descanso: nuevoEjercicio.descanso ? parseInt(nuevoEjercicio.descanso) : null,
      video_url: nuevoEjercicio.video_url?.trim() || null,
      foto_1: nuevoEjercicio.foto_1?.trim() || null,
      foto_2: nuevoEjercicio.foto_2?.trim() || null,
      foto_3: nuevoEjercicio.foto_3?.trim() || null,
    };

    await createEjercicio(payload);

    setNuevoEjercicio({
      nombre: "",
      clase: "",
      descripcion: "",
      series: "",
      repeticiones: "",
      descanso: "",
      video_url: "",
      foto_1: "",
      foto_2: "",
      foto_3: "",
    });

    fetchEjercicios();
  };

  const handleDelete = async (id: number, editable: boolean) => {
    if (!editable) return alert("No puedes borrar un ejercicio precargado");
    await deleteEjercicio(id);
    fetchEjercicios();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ejercicios</h2>

      {/* Formulario para crear ejercicio */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        <input type="text" name="nombre" placeholder="Nombre" value={nuevoEjercicio.nombre} onChange={handleChange} className="border p-2" />
        <input type="text" name="clase" placeholder="Clase" value={nuevoEjercicio.clase} onChange={handleChange} className="border p-2" />
        <textarea name="descripcion" placeholder="Descripción" value={nuevoEjercicio.descripcion} onChange={handleChange} className="border p-2" />
        <input type="number" name="series" placeholder="Series" value={nuevoEjercicio.series} onChange={handleChange} className="border p-2" />
        <input type="number" name="repeticiones" placeholder="Repeticiones" value={nuevoEjercicio.repeticiones} onChange={handleChange} className="border p-2" />
        <input type="number" name="descanso" placeholder="Descanso (s)" value={nuevoEjercicio.descanso} onChange={handleChange} className="border p-2" />
        <input type="text" name="video_url" placeholder="URL Video" value={nuevoEjercicio.video_url} onChange={handleChange} className="border p-2" />
        <input type="text" name="foto_1" placeholder="URL Foto 1" value={nuevoEjercicio.foto_1} onChange={handleChange} className="border p-2" />
        <input type="text" name="foto_2" placeholder="URL Foto 2" value={nuevoEjercicio.foto_2} onChange={handleChange} className="border p-2" />
        <input type="text" name="foto_3" placeholder="URL Foto 3" value={nuevoEjercicio.foto_3} onChange={handleChange} className="border p-2" />
        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded col-span-1 md:col-span-2">
          Crear
        </button>
      </div>

      {/* Lista de ejercicios */}
      <ul>
        {ejercicios.map((e) => (
          <li key={e.id} className="mb-4 border p-2 rounded flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h3 className="font-bold">{e.nombre} {!e.editable && "🔒"}</h3>
              <p>{e.clase} {e.descripcion && `- ${e.descripcion}`}</p>
              <p>Series: {e.series ?? "-"} | Reps: {e.repeticiones ?? "-"} | Descanso: {e.descanso ?? "-"} s</p>
              {e.video_url && <a href={e.video_url} target="_blank" rel="noreferrer" className="text-blue-500">Ver video</a>}
              <div className="flex gap-2 mt-1">
                {e.foto_1 && <img src={e.foto_1} alt="foto1" className="w-16 h-16 object-cover rounded" />}
                {e.foto_2 && <img src={e.foto_2} alt="foto2" className="w-16 h-16 object-cover rounded" />}
                {e.foto_3 && <img src={e.foto_3} alt="foto3" className="w-16 h-16 object-cover rounded" />}
              </div>
            </div>
            {e.editable && (
              <button
                onClick={() => handleDelete(e.id, e.editable)}
                className="bg-red-500 text-white px-2 py-1 rounded mt-2 md:mt-0"
              >
                Borrar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ejercicios;