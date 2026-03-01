import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaImage, FaVideo, FaSearch, FaChevronDown } from "react-icons/fa";
import { getMusculos } from "../../../services/musculos";

import Button from "../../../components/Buttons";
import Modal from "../../../components/Modal"; 

// --- COMPONENTE INTERNO: SELECT CON BUSCADOR (Sincronizado con tu estilo) ---
const SearchableSelect: React.FC<{
  label?: string;
  options: { id: any; nombre: string; color?: string }[];
  value: any;
  onChange: (val: any) => void;
  placeholder?: string;
}> = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(opt =>
    opt.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.id.toString() === value?.toString());

  return (
    <div className="space-y-1 relative">
      {label && <label className="text-[10px] font-black uppercase text-gray-500 ml-2 italic">{label}</label>}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white/5 border ${isOpen ? 'border-purple-500' : 'border-white/10'} p-4 rounded-2xl text-white flex justify-between items-center cursor-pointer hover:border-purple-500/50 transition-all`}
      >
        <span className={selectedOption ? "text-white text-sm font-bold uppercase" : "text-gray-500 text-sm"}>
          {selectedOption ? selectedOption.nombre : placeholder || "Seleccionar..."}
        </span>
        <FaChevronDown size={10} className={`text-purple-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-[#1c2030] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200">
          <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-white/5">
            <FaSearch size={12} className="text-gray-500" />
            <input 
              autoFocus
              className="bg-transparent border-none outline-none text-xs text-white w-full uppercase font-bold"
              placeholder="BUSCAR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-48 overflow-y-auto no-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`p-4 text-[11px] font-black uppercase cursor-pointer hover:bg-purple-600/20 hover:text-purple-400 transition-colors border-b border-white/5 last:border-none ${opt.id.toString() === value?.toString() ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
                >
                  {opt.nombre}
                </div>
              ))
            ) : (
              <div className="p-4 text-[10px] text-gray-500 uppercase text-center font-black">Sin resultados</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
interface Musculo { id: number; nombre: string; }
interface Secundario { id: number; intensidad: "Alto" | "Medio" | "Bajo"; }

interface Props {
  userRole: string | null;
  ejercicio?: any;
  onClose: () => void;
  onSuccess: (data: any, isEdit: boolean) => void;
}

const EjercicioForm: React.FC<Props> = ({ userRole, ejercicio, onClose, onSuccess }) => {
  const [musculosDB, setMusculosDB] = useState<Musculo[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    clase: "Personalizado",
    descripcion: "",
    video_url: "", 
    musculo_principal_id: "",
  });

  const [fotos, setFotos] = useState<{ [key: string]: File | null }>({
    foto_1: null, foto_2: null, foto_3: null,
  });

  const [secundarios, setSecundarios] = useState<Secundario[]>([]);

  const opcionesIntensidad = [
    { id: "Alto", nombre: "Alto" },
    { id: "Medio", nombre: "Medio" },
    { id: "Bajo", nombre: "Bajo" },
  ];

  useEffect(() => {
    const fetchMusculos = async () => {
      try {
        const data = await getMusculos();
        setMusculosDB(data);
      } catch (error) { console.error("Error cargando músculos", error); }
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

  const addSecundario = () => setSecundarios([...secundarios, { id: 0, intensidad: "Medio" }]);
  const removeSecundario = (index: number) => setSecundarios(secundarios.filter((_, i) => i !== index));
  const updateSecundario = (index: number, field: keyof Secundario, value: any) => {
    const newSec = [...secundarios];
    newSec[index] = { ...newSec[index], [field]: value };
    setSecundarios(newSec);
  };

  const handleSubmit = () => {
    if (!formData.nombre || !formData.musculo_principal_id) return;
    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("clase", formData.clase);
    data.append("descripcion", formData.descripcion);
    data.append("video_url", formData.video_url);
    data.append("musculo_principal_id", formData.musculo_principal_id);
    data.append("secundarios", JSON.stringify(secundarios.filter(s => s.id !== 0)));
    if (fotos.foto_1) data.append("foto_1", fotos.foto_1);
    if (fotos.foto_2) data.append("foto_2", fotos.foto_2);
    if (fotos.foto_3) data.append("foto_3", fotos.foto_3);
    onSuccess(data, !!ejercicio);
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={ejercicio ? "Editar Arsenal" : "Nuevo Ejercicio"}
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar pr-1">
        
        {/* Badge de Rol usando Text reutilizable */}
        <div className="flex justify-end">
          <span className="text-[9px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full font-black uppercase tracking-widest">
            {userRole || 'Admin'}
          </span>
        </div>

        {/* Input Nombre */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-500 ml-2 italic">Nombre del Ejercicio</label>
          <input 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-purple-500 transition-all font-bold uppercase text-sm"
            placeholder="Ej: PRESS MILITAR"
            value={formData.nombre}
            onChange={e => setFormData({...formData, nombre: e.target.value})}
          />
        </div>

        {/* Select Músculo Principal */}
        <SearchableSelect 
          label="Músculo Principal (Enfoque)"
          options={musculosDB.map(m => ({ id: m.id, nombre: m.nombre }))}
          value={formData.musculo_principal_id}
          onChange={(val) => setFormData({...formData, musculo_principal_id: val.toString()})}
          placeholder="BUSCAR MÚSCULO..."
        />

        {/* Músculos Secundarios */}
        <div className="space-y-3">
          <div className="flex justify-between items-center ml-2">
            <label className="text-[10px] font-black uppercase text-gray-500 italic">Músculos Secundarios</label>
            <button onClick={addSecundario} className="text-purple-400 text-[10px] font-black uppercase flex items-center gap-1 hover:scale-105 transition-transform">
              <FaPlus size={8}/> Añadir
            </button>
          </div>
          <div className="space-y-3">
            {secundarios.map((sec, index) => (
              <div key={index} className="flex gap-2 items-start bg-white/5 p-3 rounded-[2rem] border border-white/5 animate-in slide-in-from-left-2 duration-300">
                <div className="flex-1">
                  <SearchableSelect 
                    options={musculosDB
                      .filter(m => m.id.toString() !== formData.musculo_principal_id)
                      .map(m => ({ id: m.id, nombre: m.nombre }))}
                    value={sec.id}
                    onChange={(val) => updateSecundario(index, 'id', val)}
                    placeholder="MÚSCULO..."
                  />
                </div>
                <div className="w-32">
                  <SearchableSelect 
                    options={opcionesIntensidad}
                    value={sec.intensidad}
                    onChange={(val) => updateSecundario(index, 'intensidad', val)}
                  />
                </div>
                <button onClick={() => removeSecundario(index)} className="mt-4 p-2 text-red-500/30 hover:text-red-500 transition-colors">
                  <FaTrash size={14}/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Multimedia */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-gray-500 ml-2 italic">Multimedia (Fotos)</label>
          <div className="grid grid-cols-1 gap-2">
            {["foto_1", "foto_2", "foto_3"].map((name, idx) => {
              const fileSelected = fotos[name];
              const existingUrl = ejercicio ? ejercicio[name] : null;
              return (
                <div key={name} className="relative group">
                  <input type="file" name={name} onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className={`w-full bg-white/5 border ${fileSelected || existingUrl ? 'border-purple-500/50' : 'border-white/10'} rounded-2xl p-4 flex items-center gap-4 group-hover:border-purple-500 transition-all`}>
                    <FaImage className={fileSelected || existingUrl ? "text-purple-400" : "text-gray-600"} />
                    <span className="text-[10px] text-gray-400 uppercase font-black truncate">
                      {fileSelected ? (fileSelected as File).name : (existingUrl ? `Actual: ${existingUrl.split('/').pop()}` : `Seleccionar Foto ${idx + 1}`)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Video Tutorial */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-500 ml-2 italic">Video Tutorial</label>
          <div className="relative">
            <FaVideo className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" />
            <input 
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-purple-500 transition-all text-xs font-bold"
              placeholder="URL DE YOUTUBE O VIMEO"
              value={formData.video_url}
              onChange={e => setFormData({...formData, video_url: e.target.value})}
            />
          </div>
        </div>

        {/* Instrucciones */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-500 ml-2 italic">Instrucciones</label>
          <textarea 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-purple-500 transition-all h-28 resize-none text-sm leading-relaxed"
            placeholder="Describe los puntos clave del movimiento..."
            value={formData.descripcion}
            onChange={e => setFormData({...formData, descripcion: e.target.value})}
          />
        </div>
      </div>

      {/* Footer con tus Botones Reutilizables */}
      <div className="flex flex-col gap-3 mt-8">
        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleSubmit}
          className="w-full !rounded-2xl uppercase font-black tracking-widest"
        >
          {ejercicio ? "ACTUALIZAR" : "PUBLICAR EN ARES"}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClose}
          className="w-full border-none !text-gray-600 hover:!text-white"
        >
          CANCELAR
        </Button>
      </div>
    </Modal>
  );
};

export default EjercicioForm;