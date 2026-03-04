import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // 🔹 IMPORTANTE
import { 
  FaChevronLeft, FaCalendarAlt, FaChevronRight,
} from "react-icons/fa";

import api from "../../services/api";

// --- COMPONENTES REUTILIZABLES ---
import Text from "../../components/Texts";
import Button from "../../components/Buttons";
import CardLayout from "../../components/CardLayout";
import CalendarioInfo from "./modales/CalendarioInfo";

const CalendarioView: React.FC = () => {
  const navigate = useNavigate(); 
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [fechaStr, setFechaStr] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [diasConActividad, setDiasConActividad] = useState<number[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const cargarResumenMes = useCallback(async () => {
    setDiasConActividad([]); 

    try {
      const response = await api.get(`/calendario/mes/${year}/${month + 1}`);
      const dias = Array.isArray(response.data) ? response.data.map(Number) : [];
      setDiasConActividad(dias); 
    } catch (error: any) {
      console.error("Error cargando indicadores:", error.message);
    }
  }, [year, month]);

  useEffect(() => {
    cargarResumenMes();
  }, [cargarResumenMes]);

  const handleDayClick = async (dia: number) => {
    const fechaKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    setFechaStr(`${dia} de ${monthName}, ${year}`);
    setLoading(true);

    try {
        const response = await api.get(`/calendario/detalle/${fechaKey}`);
        setSelectedData(response.data.data);
        setIsModalOpen(true);
    } catch (error) {
        console.error("Error cargando detalle:", error);
    } finally {
        setLoading(false); 
    }
  };

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  return (
    <div className="flex flex-col h-auto w-full font-sans bg-[#0f111a] min-h-screen">
      <header className="sticky top-0 z-40 bg-[#0f111a]/95 backdrop-blur-xl border-b border-white/5 p-4 md:p-6">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="group flex items-center gap-3 active:scale-95 transition-all w-fit">
              <FaChevronLeft className="text-purple-500" />
              <div className="flex flex-col items-start">
                <Text size="2xl" weight="black" variant="gradient" className="uppercase tracking-tighter leading-none italic">ARES</Text>
                <Text size="xs" className="text-gray-500 font-bold tracking-widest uppercase italic">Bitácora / Historial</Text>
              </div>
            </button>
            <div className="p-3 bg-purple-600/10 rounded-2xl border border-purple-500/20">
              <FaCalendarAlt className={`text-purple-500 ${loading ? 'animate-spin' : ''}`} />
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="flex flex-col">
            <Text size="3xl" weight="black" variant="gradient" className="uppercase leading-none italic">CALENDARIO</Text>
            <div className="flex items-center gap-2 mt-2">
              <Text size="sm" weight="bold" className="text-purple-400 uppercase tracking-[0.2em]">{monthName}</Text>
              <span className="w-1 h-1 bg-gray-800 rounded-full" />
              <Text size="sm" weight="black" className="text-gray-600 font-mono">{year}</Text>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="glass" size="sm" onClick={prevMonth} className="!px-4"><FaChevronLeft size={12} /></Button>
            <Button variant="primary" size="sm" onClick={() => setCurrentDate(new Date())} className="!text-[10px] tracking-widest uppercase">HOY</Button>
            <Button variant="glass" size="sm" onClick={nextMonth} className="!px-4"><FaChevronRight size={12} /></Button>
          </div>
        </div>

        <div className="max-w-[600px] mx-auto">
          <CardLayout className="p-4 md:p-6 bg-black/40 border-white/5 shadow-2xl overflow-hidden relative rounded-3xl">
            {loading && <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10 flex items-center justify-center" />}
            
            <div className="grid grid-cols-7 mb-6">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                <div key={d} className="text-center">
                  <Text size="xs" weight="black" className="text-gray-600 uppercase tracking-tighter">{d}</Text>
                </div>
              ))}
            </div>

            <div key={`${year}-${month}`} className="grid grid-cols-7 gap-2 md:gap-3 animate-in fade-in duration-500">
              {Array.from({ length: startingDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dia = i + 1;
                const esHoy = new Date().toDateString() === new Date(year, month, dia).toDateString();
                const tieneData = diasConActividad.includes(dia);

                return (
                  <button
                    key={dia}
                    onClick={() => handleDayClick(dia)}
                    className={`
                      relative aspect-square rounded-xl flex flex-col items-center justify-center 
                      transition-all duration-300 group active:scale-90
                      ${esHoy 
                        ? 'bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] border-none' 
                        : tieneData 
                          ? 'bg-white/[0.08] border border-white/10 hover:border-purple-500/40 hover:bg-purple-600/5' 
                          : 'bg-white/[0.02] border border-transparent opacity-30 hover:opacity-100'
                      }
                    `}
                  >
                    <span className={`text-sm md:text-base font-black italic ${esHoy ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {dia}
                    </span>
                    
                    {tieneData && (
                      <div className={`
                        absolute bottom-1.5 w-1.5 h-1.5 rounded-full 
                        ${esHoy ? 'bg-white' : 'bg-purple-500 shadow-[0_0_8px_#a855f7]'}
                      `} />
                    )}
                  </button>
                );
              })}
            </div>
          </CardLayout>

          <div className="mt-4 flex items-center justify-center gap-6 opacity-50">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <Text size="xs" weight="black" className="uppercase tracking-widest text-[9px]">Entrenamiento</Text>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/20 border border-white/40 rounded-full" />
                <Text size="xs" weight="black" className="uppercase tracking-widest text-[9px]">Sin datos</Text>
            </div>
          </div>
        </div>
      </main>

      <CalendarioInfo 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedData} 
        fecha={fechaStr} 
      />
    </div>
  );
};

export default CalendarioView;