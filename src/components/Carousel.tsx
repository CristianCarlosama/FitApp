import React from "react";

interface CarouselProps {
  children: React.ReactNode;
  gap?: string;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({ children, gap = "gap-2", className = "" }) => {
  return (
    <div className={`relative w-full group`}>
      <div 
        className={`
          flex overflow-x-auto overflow-y-hidden 
          ${gap} 
          ${className} 
          no-scrollbar scroll-smooth
        `}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>
    </div>
  );
};

export default Carousel;