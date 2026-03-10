import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import Text from "./Texts";
import SearchInput from "./SearchInput";
import Carousel from "./Carousel";
import Button from "./Buttons";

interface ViewHeaderProps {
  title: string;           // Ej: "ARES"
  subtitle: string;        // Ej: "Rutinas / Explorar"
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  // Propiedades opcionales para los filtros
  activeFilter?: string | null;
  filters?: string[];
  onFilterClick?: (filter: string | null) => void;
  children?: React.ReactNode; // Por si quieres meter algo extra abajo
}

const ViewHeader: React.FC<ViewHeaderProps> = ({
  title,
  subtitle,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  activeFilter,
  filters = [],
  onFilterClick,
  children
}) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-[#0f111a]/95 backdrop-blur-xl border-b border-white/5 p-6">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* FILA SUPERIOR: NAV + BUSCADOR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-3 active:scale-95 transition-all text-left self-start md:self-center"
          >
            <FaChevronLeft className="text-purple-500 text-xl group-hover:-translate-x-1 transition-transform" />
            <div className="flex flex-col items-start">
              <Text size="2xl" weight="black" variant="gradient" className="uppercase italic leading-none">
                {title}
              </Text>
              <Text size="xs" className="text-gray-500 font-bold tracking-widest uppercase italic">
                {subtitle}
              </Text>
            </div>
          </button>

          {onSearchChange && (
            <div className="w-full md:w-96">
              <SearchInput 
                value={searchTerm || ""} 
                onChange={onSearchChange} 
                placeholder={searchPlaceholder} 
              />
            </div>
          )}
        </div>

        {/* FILA INFERIOR: CAROUSEL DE FILTROS */}
        {filters.length > 0 && onFilterClick && (
          <Carousel className="w-full">
            <Button 
              variant={activeFilter === null ? "primary" : "glass"} 
              size="sm" 
              onClick={() => onFilterClick(null)}
              className="flex-shrink-0 !rounded-full !px-8"
            >
              TODOS
            </Button>
            {filters.map(f => (
              <Button 
                key={f}
                variant={activeFilter === f ? "primary" : "glass"} 
                size="sm" 
                onClick={() => onFilterClick(f)}
                className="flex-shrink-0 !rounded-full !px-8"
              >
                {f}
              </Button>
            ))}
          </Carousel>
        )}
        
        {children}
      </div>
    </header>
  );
};

export default ViewHeader;