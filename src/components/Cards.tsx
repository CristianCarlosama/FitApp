import React from 'react';
import Text from './Texts';

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string; 
}

const Card: React.FC<CardProps> = ({ title, description, icon, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative group overflow-hidden
        bg-[#1c2030]/60 backdrop-blur-xl
        border border-white/5 hover:border-purple-500/50
        rounded-3xl p-8 
        transition-all duration-500 ease-out
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        hover:-translate-y-3 cursor-pointer
        flex flex-col items-center text-center
        ${className}
      `}
    >
      {/* Efecto de luz interna al hacer hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Contenedor del Icono con Glow */}
      <div className="relative z-10 mb-6 transition-transform duration-500 group-hover:scale-110">
        <div className="absolute inset-0 blur-2xl opacity-20 group-hover:opacity-50 transition-opacity duration-500 bg-current" />
        <div className="relative text-5xl">
          {icon}
        </div>
      </div>

      {/* Textos ajustados al modo oscuro */}
      <div className="relative z-10">
        <Text 
          size="xl" 
          weight="bold" 
          className="mb-3 text-white group-hover:text-purple-400 transition-colors"
        >
          {title}
        </Text>
        <Text 
          size="sm" 
          className="text-gray-400 group-hover:text-gray-300 leading-relaxed"
        >
          {description}
        </Text>
      </div>

      {/* Decoración: Línea brillante inferior que aparece en hover */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent group-hover:w-full transition-all duration-500" />
    </div>
  );
};

export default Card;