import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay con blur fuerte */}
      <div 
        className="absolute inset-0 bg-[#0f111a]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-xl bg-[#161925]/90 border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          {title && (
            <h2 className="text-xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent uppercase tracking-wider">
              {title}
            </h2>
          )}
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Contenido con scroll personalizado */}
        <div className="p-8 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;