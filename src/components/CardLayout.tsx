import React from "react";

interface CardLayoutProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const CardLayout: React.FC<CardLayoutProps> = ({ children, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`
        group relative 
        bg-[#161925] 
        rounded-[2rem] 
        border border-white/5 
        overflow-hidden 
        hover:border-purple-500/50 
        transition-all duration-300 
        flex flex-col 
        shadow-xl 
        cursor-pointer
        ${className}
      `}
    >
      {children}
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent group-hover:w-full transition-all duration-500" />
    </div>
  );
};

export default CardLayout;