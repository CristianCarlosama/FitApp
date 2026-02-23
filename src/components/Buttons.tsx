import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "glass";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden rounded-xl";

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base tracking-wide",
  };

  const variants = {
    // Estilo FitApp: Púrpura con glow
    primary: "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] hover:-translate-y-0.5",
    
    // Azul tecnológico
    secondary: "bg-[#1c2030] text-blue-400 border border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500",
    
    // Peligro con glow rojo
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/10",
    
    // Outline minimalista para el modo oscuro
    outline: "border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white hover:border-white/20",

    // Efecto cristal (muy usado en interfaces modernas)
    glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10"
  };

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`} 
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;