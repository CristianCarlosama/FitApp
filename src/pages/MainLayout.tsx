import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import logo from '../assets/AresGymFT.png';
import { 
  FaUserCircle, FaCog, FaLifeRing, FaDumbbell, FaSignOutAlt, FaBars, FaTimes, 
  FaHome
} from 'react-icons/fa';
import Text from '../components/Texts';
import Button from '../components/Buttons';

import RegisterModal from '../pages/modales/RegisterModal';
import LoginModal from '../pages/modales/LoginModal';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [location]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUserRole(payload.role);
        } catch (e) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/");
    window.dispatchEvent(new Event('auth-change'));
  };

  return (
    <div className="min-h-screen w-full bg-[#0f111a] text-white flex overflow-x-hidden font-sans">
      
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR IZQUIERDA */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#161925] border-r border-white/10 z-50 transition-all duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-purple-500/10" />
              <Text size="2xl" weight="bold">FIT<span className="text-purple-500">APP</span></Text>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white transition"><FaTimes size={24} /></button>
          </div>
          
          <nav className="flex-1 space-y-1">
            <NavItem icon={<FaHome />} label="Inicio" active={location.pathname === "/"} onClick={() => navigate("/")}/>
            <NavItem icon={<FaUserCircle />} label="Mi Cuenta" />
            <NavItem icon={<FaCog />} label="Configuración" />
            <NavItem icon={<FaLifeRing />} label="Soporte Técnico" />
            
            {(userRole === "Admin" || userRole === "Dev") && (
              <div className="pt-4 mt-4 border-t border-white/5">
                <Text size="xs" className="px-4 mb-2 text-gray-500 font-bold uppercase tracking-widest">Admin</Text>
                <NavItem icon={<FaDumbbell />} label="CRUD Ejercicios" active={location.pathname === "/crud-ejercicios"} onClick={() => navigate("/crud-ejercicios")} />
              </div>
            )}
          </nav>

          {/* SECCIÓN DE AUTENTICACIÓN */}
          <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
            {isAuthenticated ? (
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-3 text-red-400 hover:bg-red-500/10 w-full p-3 rounded-xl transition-all duration-300 group"
              >
                <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" /> 
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Button 
                  variant="primary" 
                  onClick={() => setShowLogin(true)}
                >
                  Entrar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRegister(true)}
                >
                  Registrarse
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* CONTENIDO CENTRAL */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-72 xl:mr-80 min-h-screen relative">
        <header className="lg:hidden h-16 flex items-center justify-between px-6 bg-[#161925]/80 backdrop-blur-md sticky top-0 z-30 border-b border-white/5">
          <div className="flex-1 flex justify-start">
            <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white/5 rounded-lg active:scale-95 transition-transform"><FaBars /></button>
          </div>
          <div className="flex-none cursor-pointer" onClick={() => navigate("/")}><Text size="lg" weight="bold">ARESAPP</Text></div>
          <div className="flex-1 flex justify-end">
            <img src={logo} alt="Logo" className="w-8 h-8 rounded-full object-cover border border-white/10" onClick={() => navigate("/")} />
          </div>
        </header>

        <div className="flex-1 w-full max-w-[1600px] mx-auto">
          <Outlet /> 
        </div>
      </main>

      {/* SIDEBAR DERECHA */}
      <aside className="hidden xl:flex fixed top-0 right-0 h-full w-80 bg-[#161925] border-l border-white/10 p-8 flex-col z-40">
        <Text size="lg" weight="bold" className="mb-6 text-green-400 uppercase tracking-widest italic">Recomendados</Text>
        <div className="space-y-6">
          <div className="rounded-2xl overflow-hidden aspect-video bg-gray-800 border border-white/5 relative group shrink-0 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400" 
              className="opacity-50 group-hover:scale-110 transition duration-500 w-full h-full object-cover" 
              alt="Suplementos" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 p-4 flex flex-col justify-end">
              <span className="text-xs font-black text-white uppercase leading-none">Suplementos 20% OFF</span>
              <span className="text-[10px] text-green-400 font-bold mt-1">Código: ARES2026</span>
            </div>
          </div>
          <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5">
            <Text size="sm" weight="black" className="uppercase mb-4 text-purple-400">Anuncio Premium</Text>
            <div className="w-full h-20 rounded-2xl bg-[#1c2030] border border-dashed border-white/20 flex items-center justify-center text-gray-500 text-[10px] font-bold tracking-widest uppercase px-4 text-center">Mejora tu cuenta ahora</div>
          </div>
        </div>
      </aside>

      {/* MODALES DISPONIBLES EN TODA LA APP */}
      <RegisterModal 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)} 
      />
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setShowLogin(false);
          window.location.reload(); 
        }} 
        onSwitchToRegister={() => {
          setShowLogin(false); 
          setShowRegister(true); 
        }}
      />
    </div>
  );
};

const NavItem = ({ icon, label, onClick, active }: any) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all duration-300 group ${
      active ? 'bg-purple-600/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <span className={`text-xl transition-colors ${active ? 'text-purple-500' : 'group-hover:text-purple-400'}`}>
      {icon}
    </span>
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export default MainLayout;