import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './pages/MainLayout';
import Landing from './pages/Landing';
import EjerciciosView from './pages/Ejercicios/EjerciciosView';
import RutinasView from './pages/Rutinas/RutinasView';
import CronometroView from './pages/Cronometro/CronometroView';
import TemporizadorView from './pages/Temporizador/TemporizadorView';
import CalendarioView from './pages/Calendario/CalendarioView';
import CRUDEjercicios from './pages/EjercicioDev/CRUDEjercicios';
import SesionActiva from './pages/Entrenamiento/SesionActiva';

const AppContent = () => {
  const navigate = useNavigate();

  const handleStartWorkout = (rutina: any) => {
    navigate('/entrenamientos', { state: { rutina } }); 
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/ejercicios" element={<EjerciciosView />} />
        <Route 
          path="/rutinas" 
          element={<RutinasView onStartWorkout={handleStartWorkout} />} 
        />
        <Route path="/entrenamientos" element={<SesionActiva />} />
        <Route path="/cronometro" element={<CronometroView />} />
        <Route path="/temporizador" element={<TemporizadorView />} />
        <Route path="/calendario" element={<CalendarioView />} />
        <Route 
          path="/crud-ejercicios" 
          element={<CRUDEjercicios userRole="Dev" />} 
        />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;