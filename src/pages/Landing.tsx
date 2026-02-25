import React, { useState, useEffect } from 'react';
import logo from '../assets/AresGymFT.png'
import RegisterModal from './modales/RegisterModal';
import LoginModal from './modales/LoginModal';
import EjerciciosView from './Ejercicios/EjerciciosView';
import CRUDEjercicios from './EjercicioDev/CRUDEjercicios';
import TemporizadorView from './Temporizador/TemporizadorView';
import CronometroView from './Cronometro/CronometroView';
import Button from '../components/Buttons';
import Text from '../components/Texts';
import Card from '../components/Cards';
import { 
  FaStopwatch, FaClock, FaDumbbell, FaTasks, FaBullseye,
  FaRuler, FaCommentDots, FaMapMarkedAlt, FaBars, FaTimes,
  FaUserCircle, FaCog, FaLifeRing, FaSignOutAlt, FaImages 
} from 'react-icons/fa';
import RutinasView from './Rutinas/RutinasView';

type ViewType =
  | "landing"
  | "cronometro"
  | "temporizador"
  | "ejercicios"
  | "crudEjercicios"
  | "rutinas"
  | "metas"
  | "mapa"
  | "medidas"
  | "comentarios"
  | "fotos";

const Landing: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Controlar contenido principal
  const [activeView, setActiveView] = useState<ViewType>(() => {
    return (localStorage.getItem("activeView") as ViewType) || "landing";
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
      } catch (e) {
        console.error("Error parseando token:", e);
      }
    }
  }, []);

  console.log("ROL DEL USUARIO:", userRole);

  const renderView = () => {
    switch (activeView) {
      case "crudEjercicios":
        return <CRUDEjercicios 
          userRole={userRole} goBack={() => setActiveView("landing")} 
        />;

      case "ejercicios":
        return <EjerciciosView 
          goBack={() => setActiveView("landing")}
        />;

      case "cronometro":
        return <CronometroView 
          goBack={() => setActiveView("landing")}
        />;

      case "temporizador":
        return <TemporizadorView 
          goBack={() => setActiveView("landing")}
        />;

      case "rutinas":
        return <RutinasView 
          goBack={() => setActiveView("landing")}
        />;

      case "metas":
        return (
            <div className="p-10 space-y-4">
              <button
                onClick={() => setActiveView("landing")}
                className="text-gray-400 hover:text-white transition"
              >
                ← Volver
              </button>

              <div>Vista Metas</div>
            </div>
          );

      case "mapa":
        return (
            <div className="p-10 space-y-4">
              <button
                onClick={() => setActiveView("landing")}
                className="text-gray-400 hover:text-white transition"
              >
                ← Volver
              </button>

              <div>Vista Mapa</div>
            </div>
          );

      case "medidas":
        return (
            <div className="p-10 space-y-4">
              <button
                onClick={() => setActiveView("landing")}
                className="text-gray-400 hover:text-white transition"
              >
                ← Volver
              </button>

              <div>Vista Medidas</div>
            </div>
          );

      case "comentarios":
        return (
            <div className="p-10 space-y-4">
              <button
                onClick={() => setActiveView("landing")}
                className="text-gray-400 hover:text-white transition"
              >
                ← Volver
              </button>

              <div>Vista Comentarios</div>
            </div>
          );

      case "fotos":
        return (
            <div className="p-10 space-y-4">
              <button
                onClick={() => setActiveView("landing")}
                className="text-gray-400 hover:text-white transition"
              >
                ← Volver
              </button>

              <div>Vista Fotos</div>
            </div>
          );

      default:
        return (
          <div className="p-6 md:p-10 w-full max-w-none mx-auto space-y-12 pb-[50px]">
            {/* contenido actual de la landing */}
          </div>
        );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    setIsAuthenticated(false);
    setUserRole(null);
    setActiveView("landing");
  };

  const cards = [
    { title: 'Cronómetro', 
      view: 'cronometro',
      icon: <FaStopwatch className="text-purple-400" />, 
      description: 'Mide tus tiempos.' 
    },
    { title: 'Temporizador', 
      view: 'temporizador',
      icon: <FaClock className="text-blue-400" />, 
      description: 'Sesiones de descanso.' 
    },
    { title: 'Ejercicios', 
      view: 'ejercicios',
      icon: <FaDumbbell className="text-green-400" />, 
      description: 'Explora rutinas.' 
    },
    { title: 'Rutinas', 
      view: 'rutinas',
      icon: <FaTasks className="text-orange-400" />, 
      description: 'Tus planes diarios.' 
    },
    { title: 'Metas', 
      view: 'metas',
      icon: <FaBullseye className="text-red-400" />, 
      description: 'Objetivos claros.'
    },
    { title: 'Mapa',
      view: 'mapa',
      icon: <FaMapMarkedAlt className="text-cyan-400" />, 
      description: 'Rutas cercanas.' 
    },
    { title: 'Medidas', 
      view: 'medidas',
      icon: <FaRuler className="text-emerald-400" />, 
      description: 'Medidas Corporales.' 
    },
    { title: 'Comentarios', 
      view: 'comentarios',
      icon: <FaCommentDots className="text-yellow-400" />, 
      description: 'Motívate tú mismo.' },
    { title: 'Fotos', 
      view: 'fotos',
      icon: <FaImages className="text-pink-400" />, 
      description: 'Sigue tu progreso.' 
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0f111a] text-white flex font-sans overflow-x-hidden">
      
      {/* OVERLAY PARA MÓVIL */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR IZQUIERDA */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#161925] border-r border-white/10 z-50 transition-all duration-300 transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div 
                onClick={() => setActiveView("landing")}
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
              >
                <img 
                  src={logo} 
                  alt="Logo FITAPP" 
                  className="w-10 h-10 rounded-xl" />
              </div>
              <Text size="2xl" weight="bold">FIT<span className="text-purple-500">APP</span></Text>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white transition">
              <FaTimes size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem icon={<FaUserCircle />} label="Mi Cuenta" />
            <NavItem icon={<FaCog />} label="Configuración" />
            <NavItem icon={<FaLifeRing />} label="Soporte Técnico" />
            
            {/* ITEM SOLO PARA ADMIN/DEV */}
            {(userRole === "Admin" || userRole === "Dev") && (
              <NavItem 
                icon={<FaDumbbell />} 
                label="CRUD Ejercicios" 
                onClick={() => setActiveView("crudEjercicios")} 
              />
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
            {!isAuthenticated ? (
              <>
                <Button variant="primary" className="w-full !rounded-xl" onClick={() => setShowLogin(true)}>Entrar</Button>
                <Button variant="outline" className="w-full !rounded-xl !bg-transparent !border-white/10" onClick={() => setShowRegister(true)}>Registrarse</Button>
              </>
            ) : (
              <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:bg-red-500/10 w-full p-3 rounded-xl transition">
                <FaSignOutAlt /> <span className="font-medium">Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-72 xl:mr-80 transition-all duration-300 z-10 relative">
        
        {/* TOPBAR MÓVIL */}
        <header className="lg:hidden h-16 flex items-center justify-between px-6 bg-[#161925]/80 backdrop-blur-md sticky top-0 z-30 border-b border-white/5">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 bg-white/5 rounded-lg"
          >
            <FaBars className="text-md" />
          </button>
          <button
            onClick={() => setActiveView("landing")}
            className="cursor-pointer"
          >
            <Text 
              size="lg" 
              weight="bold"
            >
              FITAPP
            </Text>
          </button>

          <img 
            src={logo} 
            alt="Logo FITAPP" 
            className="w-8 h-8 rounded-full cursor-pointer"
            onClick={() => setActiveView("landing")}
          />
        </header>

        {/* CONTENEDOR DE TARJETAS */}
        {activeView === "landing" ? (
          <div className="p-6 md:p-10 w-full max-w-none mx-auto space-y-12 pb-[50px]">
            
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 p-8 md:p-12">
              <div className="relative z-10 max-w-2xl">
                <Text size="4xl" weight="bold" className="mb-4">Lleva tu cuerpo al <span className="text-purple-400">Siguiente Nivel</span></Text>
                <Text className="text-gray-400 mb-6 italic">Gestiona tus rutinas, mide tus tiempos y alcanza tus metas con tecnología de punta.</Text>
                <button className="px-8 py-3 bg-white text-black font-bold rounded-xl shadow-xl hover:scale-105 transition-transform">Empezar Ahora</button>
              </div>
            </section>

            <section>
              <Text size="2xl" weight="bold" className="mb-8">Herramientas</Text>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                  <Card
                    key={idx}
                    title={card.title}
                    description={card.description}
                    icon={<span className="text-3xl mb-2 block">{card.icon}</span>}
                    onClick={() => 
                      setActiveView(card.view as ViewType
                      )}
                  />
                ))}
              </div>
            </section>

            {/* div invisible que empuja todo hacia arriba */}
            <div className="h-5 w-full pointer-events-none"></div>
          </div>
          ) : (
            renderView()
        )}

        {/* PUBLICIDAD FIJA ABAJO */}
        <div className="fixed bottom-0 left-0 lg:left-72 xl:right-80 right-0 z-40 p-4 bg-gradient-to-t from-[#0f111a] via-[#0f111a] to-transparent">
          <div className="w-full">
            <AdCard label="Publicidad Patrocinada - Haz clic aquí" />
          </div>
        </div>
      </main>

      {/* SIDEBAR DERECHA */}
      <aside className="hidden xl:flex fixed top-0 right-0 h-full w-80 bg-[#161925] border-l border-white/10 p-6 flex-col z-50">
        <Text size="lg" weight="bold" className="mb-6 text-green-400">Recomendados</Text>
        <div className="space-y-6">
          <div className="rounded-2xl overflow-hidden aspect-video bg-gray-800 border border-white/5 relative group">
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400" 
              className="opacity-50 group-hover:scale-110 transition duration-500 w-full h-full object-cover" 
              alt="Suplementos"
            />
            <div className="absolute bottom-4 left-4 font-bold">Suplementos 20% OFF</div>
          </div>
          <AdCard label="Anuncio Premium" />
        </div>
      </aside>

      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={() => setIsAuthenticated(true)} />
    </div>
  );
};

const NavItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-3.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
  >
    <span className="text-xl group-hover:text-purple-400 transition-colors">{icon}</span>
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const AdCard = ({ label }: { label: string }) => (
  <div className="w-full h-16 md:h-20 rounded-2xl bg-[#1c2030]/80 border border-dashed border-white/20 flex items-center justify-center hover:border-purple-500/50 transition-all cursor-pointer shadow-2xl">
    <span className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase px-4 text-center">{label}</span>
  </div>
);

export default Landing;