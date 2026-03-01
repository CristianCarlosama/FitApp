import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Button from "./Buttons";

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({ children, className = "" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className={`relative w-full group ${className}`}>
      {/* Botón Izquierdo */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-[#0f111a] via-[#0f111a]/50 to-transparent pr-10">
        <Button 
          variant="glass" 
          onClick={() => scroll("left")} 
          className="!p-2.5 !rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FaChevronLeft size={12} />
        </Button>
      </div>
      <div 
        ref={scrollRef} 
        className="flex overflow-x-auto gap-3 pb-4 no-scrollbar scroll-smooth px-2"
      >
        {children}
      </div>
      {/* Botón Derecho */}
      <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-[#0f111a] via-[#0f111a]/50 to-transparent pl-10">
        <Button 
          variant="glass" 
          onClick={() => scroll("right")} 
          className="!p-2.5 !rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FaChevronRight size={12} />
        </Button>
      </div>
    </div>
  );
};

export default Carousel;