import React from "react";
import { FaSearch } from "react-icons/fa";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<Props> = ({ value, onChange, placeholder = "Buscar..." }) => {
  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <FaSearch className="text-gray-500 group-focus-within:text-purple-500 transition-colors" size={14} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 py-3 pl-12 pr-4 rounded-2xl outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-sm font-medium placeholder:text-gray-600"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchInput;