import React, { useState, useEffect } from "react";
import Text from "../../../components/Texts";
import Select from "../../../components/Selects";
import { FaPlus, FaTrash, FaImage, FaVideo } from "react-icons/fa";
import { getMusculos } from "../../../services/musculos";

interface Musculo {
  id: number;
  nombre: string;
}

interface Secundario {
  id: number;
  intensidad: "Alto" | "Medio" | "Bajo";
}

interface Props {
  userRole: string | null;
  ejercicio?: any;
  onClose: () => void;
  onSuccess: (data: any, isEdit: boolean) => void;
}

const EjercicioForm: React.FC<Props> = ({ 
  userRole, 
  ejercicio, 
  onClose, 
  onSuccess 
}) => {
  const [musculosDB, setMusculosDB] = useState<Musculo[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    clase: "Personalizado",
    descripcion: "",
    video_url: "", // Nueva columna
    musculo_principal_id: "",
  });

  // Estado para manejar los archivos físicamente
  const [fotos, setFotos] = useState<{ [key: string]: File | null }>({
    foto_1: null,
    foto_2: null,
    foto_3: null,
  });

  const [secundarios, setSecundarios] = useState<Secundario[]>([]);

  const opcionesIntensidad = [
    { id: "Alto", nombre: "Alto", color: "text-purple-400" },
    { id: "Medio", nombre: "Medio", color: "text-orange-400" },
    { id: "Bajo", nombre: "Bajo", color: "text-blue-400" },
  ];

  useEffect(() => {
    const fetchMusculos = async () => {
      try {
        const data = await getMusculos();
        setMusculosDB(data);
      } catch (error) {
        console.error("Error cargando músculos", error);
      }
    };
    fetchMusculos();
  }, []);

  useEffect(() => {
    if (ejercicio) {
      setFormData({
        nombre: ejercicio.nombre || "",
        clase: ejercicio.clase || "",
        descripcion: ejercicio.descripcion || "",
        video_url: ejercicio.video_url || "",
        musculo_principal_id: ejercicio.musculos?.find((m: any) => m.pivot.es_principal)?.id.toString() || ""
      });

      const sec = ejercicio.musculos
        ?.filter((m: any) => !m.pivot.es_principal)
        .map((m: any) => ({ id: m.id, intensidad: m.pivot.intensidad }));
      
      setSecundarios(sec || []);
    }
  }, [ejercicio]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotos({ ...fotos, [e.target.name]: e.target.files[0] });
    }
  };

  const addSecundario = () => {
    setSecundarios([...secundarios, { id: 0, intensidad: "Medio" }]);
  };

  const removeSecundario = (index: number) => {
    setSecundarios(secundarios.filter((_, i) => i !== index));
  };

  const updateSecundario = (index: number, field: keyof Secundario, value: any) => {
    const newSec = [...secundarios];
    newSec[index] = { ...newSec[index], [field]: value };
    setSecundarios(newSec);
  };

  const handleSubmit = () => {
    if (!formData.nombre || !formData.musculo_principal_id) {
      alert("Nombre y músculo principal son obligatorios.");
      return;
    }

    const secundariosValidos = secundarios.filter(s => s.id !== 0);

    // USAMOS FORMDATA PARA ENVIAR ARCHIVOS
    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("clase", formData.clase);
    data.append("descripcion", formData.descripcion);
    data.append("video_url", formData.video_url);
    data.append("musculo_principal_id", formData.musculo_principal_id);
    
    // Enviamos los secundarios como JSON string para que Laravel lo procese
    data.append("secundarios", JSON.stringify(secundariosValidos));

    // Adjuntar las fotos si fueron seleccionadas
    if (fotos.foto_1) data.append("foto_1", fotos.foto_1);
    if (fotos.foto_2) data.append("foto_2", fotos.foto_2);
    if (fotos.foto_3) data.append("foto_3", fotos.foto_3);

    // Campos extra requeridos por tu lógica original
    data.append("rutina_id", "");
    data.append("series", "0");
    data.append("repeticiones", "0");
    data.append("descanso", "0");

    onSuccess(data, !!ejercicio);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#161925] border border-white/10 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[95vh] no-scrollbar">
        
        <header className="flex justify-between items-center mb-6">
          <Text size="2xl" weight="black" variant="gradient" className="uppercase leading-none">
            {ejercicio ? "Editar Ejercicio" : "Nuevo Ejercicio"}
          </Text>
          <span className="text-[9px] bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-black uppercase">
            {userRole}
          </span>
        </header>

        <div className="space-y-5">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Nombre del Ejercicio</label>
            <input 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-purple-500 transition-all"
              placeholder="Ej: Press Banca"
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <Select 
            label="Músculo Principal (Clase)"
            options={musculosDB.map(m => ({ id: m.id, nombre: m.nombre }))}
            value={formData.musculo_principal_id}
            onChange={(val) => setFormData({...formData, musculo_principal_id: val.toString()})}
            placeholder="Selecciona el enfoque..."
          />

          {/* Músculos Secundarios */}
          <div className="space-y-3">
            <div className="flex justify-between items-center ml-2">
              <label className="text-[10px] font-black uppercase text-gray-500">Músculos Secundarios</label>
              <button onClick={addSecundario} className="text-purple-400 text-[10px] font-black uppercase flex items-center gap-1">
                <FaPlus size={8}/> Añadir Músculo
              </button>
            </div>
            
            <div className="space-y-2">
              {secundarios.map((sec, index) => (
                <div key={index} className="flex gap-2 items-start bg-white/5 p-2 rounded-3xl border border-white/5">
                  <div className="flex-1">
                    <Select 
                      options={musculosDB
                        .filter(m => m.id.toString() !== formData.musculo_principal_id)
                        .map(m => ({ id: m.id, nombre: m.nombre }))}
                      value={sec.id}
                      onChange={(val) => updateSecundario(index, 'id', val)}
                    />
                  </div>
                  
                  <div className="w-32">
                    <Select 
                      options={opcionesIntensidad}
                      value={sec.intensidad}
                      onChange={(val) => updateSecundario(index, 'intensidad', val)}
                    />
                  </div>

                  <button onClick={() => removeSecundario(index)} className="p-4 text-red-500/50 hover:text-red-500">
                    <FaTrash size={12}/>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CARGA DE IMÁGENES (LAS 3 FOTOS) */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Fotos del Ejercicio (Máximo 3)</label>
            <div className="grid grid-cols-1 gap-2">
              {["foto_1", "foto_2", "foto_3"].map((name, idx) => (
                <div key={name} className="relative group">
                  <input 
                    type="file" 
                    name={name} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  />
                  <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 group-hover:border-purple-500/50 transition-all">
                    <FaImage className="text-purple-500" />
                    <span className="text-[10px] text-gray-400 uppercase font-bold truncate">
                      {fotos[name] ? (fotos[name] as File).name : `Seleccionar Foto ${idx + 1}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* URL Video */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">URL del Video (Youtube/Vimeo)</label>
            <div className="relative">
              <FaVideo className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/50" />
              <input 
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-purple-500 transition-all"
                placeholder="https://youtube.com/..."
                value={formData.video_url}
                onChange={e => setFormData({...formData, video_url: e.target.value})}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Descripción Técnica</label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-purple-500 transition-all h-24 resize-none"
              placeholder="Explica la ejecución correcta..."
              value={formData.descripcion}
              onChange={e => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>
        </div>

        <footer className="flex flex-col gap-3 mt-8">
          <button 
            onClick={handleSubmit}
            className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-500/20"
          >
            {ejercicio ? "Guardar Cambios" : "Publicar Ejercicio"}
          </button>
          <button onClick={onClose} className="text-gray-500 font-bold uppercase text-[10px] hover:text-white transition-all py-2 text-center">
            Descartar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default EjercicioForm;