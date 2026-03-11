import React, { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import Text from './Texts';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  badge?: string; 
  children: React.ReactNode;
  maxWidth?: string; 
  className?: string;  
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  badge, 
  children, 
  maxWidth = "max-w-xl",
  className = "" 
}) => {
  
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
        <div className={`relative w-full ${maxWidth} bg-[#161925] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[95vh] no-scrollbar animate-in zoom-in-95 duration-300 ${className}`}>
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 text-red-700 hover:text-red-500 transition-all hover:scale-110 active:scale-90 z-[70] p-1"
          >
            <FaPlus className="rotate-45" size={20} />
          </button>
          {(title || badge) && (
            <header className="flex justify-between items-center mb-8 pr-10">
              {title && (
                <Text size="2xl" weight="black" variant="gradient" className="uppercase leading-none italic tracking-tighter">
                  {title}
                </Text>
              )}
              {badge && (
                <span className="text-[9px] bg-purple-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">
                  {badge}
                </span>
              )}
            </header>
          )}
          <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;