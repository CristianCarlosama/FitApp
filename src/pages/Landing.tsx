import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterModal from './modales/RegisterModal';
import LoginModal from './modales/LoginModal';

import Text from '../components/Texts';
import Card from '../components/Cards';
import NotificationModal from "../components/NotificationModal";
import type { NotificationType } from "../components/NotificationModal";
import { 
  FaStopwatch, FaClock, FaDumbbell, FaTasks, FaBullseye, FaCalendarAlt,
  FaRuler, FaCommentDots, FaMapMarkedAlt, FaImages 
} from 'react-icons/fa';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  const [apiModal, setApiModal] = useState({
    isOpen: false,
    type: "info" as NotificationType,
    title: "",
    message: "",
  });

  const cards = [
    { title: 'Ejercicios', view: '/ejercicios', icon: <FaDumbbell className="text-green-400" />, description: 'Explora diferentes Ejercicios.' },
    { title: 'Rutinas', view: '/rutinas', icon: <FaTasks className="text-orange-400" />, description: 'Crea tus Rutinas' },
    { title: 'Cronómetro', view: '/cronometro', icon: <FaStopwatch className="text-purple-400" />, description: 'Mide tus tiempos.' },
    { title: 'Temporizador', view: '/temporizador', icon: <FaClock className="text-blue-400" />, description: 'Sesiones de descanso.' },
    { title: 'Metas', view: '/metas', icon: <FaBullseye className="text-red-400" />, description: 'Objetivos claros.' },
    { title: 'Mapa', view: '/mapa', icon: <FaMapMarkedAlt className="text-cyan-400" />, description: 'Rutas cercanas.' },
    { title: 'Medidas', view: '/medidas', icon: <FaRuler className="text-emerald-400" />, description: 'Medidas Corporales.' },
    { title: 'Comentarios', view: '/comentarios', icon: <FaCommentDots className="text-yellow-400" />, description: 'Motívate tú mismo.' },
    { title: 'Fotos', view: '/fotos', icon: <FaImages className="text-pink-400" />, description: 'Sigue tu progreso.' },
    { title: 'Calendario', view: '/calendario', icon: <FaCalendarAlt className="text-gray-400" />, description: 'Sigue tu progreso.' },
  ];

  return (
    <div className="p-6 md:p-10 space-y-12">
      {/* Banner Principal */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <Text size="4xl" weight="bold" className="mb-4">
            Lleva tu cuerpo al <span className="text-purple-400">Siguiente Nivel</span>
          </Text>
          <Text className="text-gray-400 mb-6 italic">
            Gestiona tus rutinas, mide tus tiempos y alcanza tus metas con tecnología de punta.
          </Text>
        </div>
      </section>

      {/* Grid de Herramientas */}
      <section>
        <Text size="2xl" weight="bold" className="mb-8">Herramientas</Text>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
          {cards.map((card, idx) => (
            <Card 
              key={idx} 
              title={card.title} 
              description={card.description} 
              icon={<span className="text-2xl md:text-3xl mb-2 block">{card.icon}</span>} 
              onClick={() => navigate(card.view)} 
            />
          ))}
        </div>
      </section>

      {/* Footer de la Landing (Publicidad) */}
      <footer className="w-full pt-6"> 
        <div 
          className="w-full h-16 md:h-20 rounded-2xl bg-[#1c2030]/80 border border-dashed border-white/20 flex items-center justify-center hover:border-purple-500/50 transition-all cursor-pointer shadow-2xl"
          onClick={() => setShowRegister(true)}
        >
          <span className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase px-4 text-center">
            Publicidad Patrocinada - Haz clic aquí
          </span>
        </div>
      </footer>

      {/* Modales necesarios para la Landing */}
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLoginSuccess={() => window.location.reload()} // Recarga para actualizar el Layout
      />
      <NotificationModal 
        isOpen={apiModal.isOpen} 
        type={apiModal.type} 
        title={apiModal.title} 
        message={apiModal.message} 
        onClose={() => setApiModal(p => ({...p, isOpen: false}))} 
      />
    </div>
  );
};

export default Landing;