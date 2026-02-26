import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

interface Option {
  id: string | number;
  nombre: string;
  color?: string; 
}

interface SelectProps {
  label?: string;
  options: Option[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, value, onChange, placeholder = "Seleccionar..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.id.toString() === value.toString());

  return (
    <div className="flex flex-col gap-1 w-full" ref={dropdownRef}>
      {label && <label className="text-[10px] font-black uppercase text-gray-500 ml-2">{label}</label>}
      
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white/5 border ${isOpen ? 'border-purple-500' : 'border-white/10'} p-4 rounded-2xl text-white flex justify-between items-center cursor-pointer transition-all hover:bg-white/10`}
        >
          <span className={`text-xs font-bold uppercase ${!selectedOption ? 'text-gray-500' : (selectedOption.color || 'text-white')}`}>
            {selectedOption ? selectedOption.nombre : placeholder}
          </span>
          <FaChevronDown className={`text-purple-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={10} />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-[#1b1f2d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
            <div className="max-h-60 overflow-y-auto no-scrollbar">
              {options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => { onChange(opt.id); setIsOpen(false); }}
                  className={`p-4 text-[10px] font-black uppercase cursor-pointer transition-colors hover:bg-white/5 ${opt.color || 'text-gray-300'} ${value === opt.id ? 'bg-purple-500/10' : ''}`}
                >
                  {opt.nombre}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;