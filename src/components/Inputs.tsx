import React from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "filled" | "glass";
  size?: "sm" | "md" | "lg";
  label?: string; // Añadimos label para que sea más funcional
}

const Input: React.FC<InputProps> = ({ 
  variant = "default", 
  size = "md", 
  label,
  className = "", 
  ...props 
}) => {
  // Estructura base con tipografía limpia y transiciones suaves
  const baseClass = "w-full bg-[#1c2030] text-white border transition-all duration-300 outline-none placeholder:text-gray-500 font-medium";

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-5 py-3 text-base rounded-xl",
    lg: "px-6 py-4 text-lg rounded-2xl",
  };

  const variants = {
    // Borde sutil que brilla al enfocar
    default: "border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10",
    
    // Fondo un poco más claro para resaltar en modales
    filled: "border-transparent bg-[#252a3d] focus:bg-[#2a3045] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10",
    
    // Estilo cristal translúcido
    glass: "bg-white/5 backdrop-blur-md border-white/10 focus:border-purple-400 focus:bg-white/10",
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
          {label}
        </label>
      )}
      <input 
        className={`${baseClass} ${sizes[size]} ${variants[variant]} ${className}`} 
        {...props} 
      />
    </div>
  );
};

export default Input;