import React from "react";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTrashAlt, FaTimes } from "react-icons/fa";
import Text from "./Texts";

export type NotificationType = "success" | "error" | "warning" | "delete" | "info";

interface NotificationModalProps {
  isOpen: boolean;
  type: NotificationType;
  title: string;
  message: string;
  onConfirm?: () => void; 
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ 
  isOpen, type, title, message, onConfirm, onClose 
}) => {
  if (!isOpen) return null;

  const config = {
    success: { icon: <FaCheckCircle className="text-green-500" size={40} />, color: "border-green-500/50" },
    error: { icon: <FaTimes className="text-red-500" size={40} />, color: "border-red-500/50" },
    warning: { icon: <FaExclamationTriangle className="text-yellow-500" size={40} />, color: "border-yellow-500/50" },
    delete: { icon: <FaTrashAlt className="text-red-500" size={40} />, color: "border-red-500/50" },
    info: { icon: <FaInfoCircle className="text-purple-500" size={40} />, color: "border-purple-500/50" },
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:left-72 xl:right-80 transition-all duration-300">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" 
        onClick={onClose} 
      />
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-[#161925] border ${config[type].color} w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center z-10`}
      >
        <div className="flex justify-center mb-4">
          {config[type].icon}
        </div>
        <Text size="xl" weight="black" className="uppercase mb-2 tracking-tight text-white">
          {title}
        </Text>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          {message}
        </p>
        <div className="flex flex-col gap-3">
          {onConfirm ? (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20"
              >
                CONFIRMAR
              </button>
              <button 
                onClick={onClose} 
                className="text-gray-500 text-[10px] font-black uppercase hover:text-white transition-colors py-2"
              >
                CANCELAR
              </button>
            </>
          ) : (
            <button 
              onClick={onClose}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-500/20"
            >
              ENTENDIDO
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;