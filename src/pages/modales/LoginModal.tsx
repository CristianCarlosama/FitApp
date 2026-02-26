import React, { useState, useEffect } from 'react';
import { login } from '../../services/auth';
import Button from '../../components/Buttons';
import Text from '../../components/Texts';
import Input from '../../components/Inputs';
import Modal from '../../components/Modal';
import NotificationModal from '../../components/NotificationModal'; 
import { FaLock } from 'react-icons/fa';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<Props> = ({ isOpen, onClose, onLoginSuccess }) => {
  const initialState = { login: '', password: '' };
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // Estado para la notificación
  const [notif, setNotif] = useState<{ 
    open: boolean; 
    title: string; 
    message: string; 
    type: 'success' | 'error' 
  }>({
    open: false,
    title: "",
    message: "",
    type: "success"
  });

  useEffect(() => {
    if (!isOpen) {
      setForm(initialState);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(form.login, form.password);

      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));

      setNotif({ 
        open: true, 
        title: "¡Éxito!", 
        message: "Acceso concedido. Entrando FitApp...", 
        type: "success" 
      });

      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      }, 1500);

    } catch (error: any) {
      console.error(error.response?.data || error.message);
      setNotif({ 
        open: true, 
        title: "Error de Acceso", 
        message: "Credenciales incorrectas.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Acceso de Usuario">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-blue-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center mb-3">
            <FaLock className="text-purple-400 text-xl" />
          </div>
          <Text size="xl" weight="black" variant="gradient">BIENVENIDO</Text>
          <Text size="xs" variant="muted" className="mt-1">Ingresa tus credenciales para continuar</Text>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="space-y-3">
            <Input
              label="Usuario o correo"
              name="login"
              placeholder="atleta@fitapp.com"
              value={form.login}
              onChange={handleChange}
              size="md"
              required
              autoComplete="off"
            />
            <Input
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              size="md"
              required
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button 
              type="submit" 
              variant="primary" 
              size="md" 
              className="w-full !rounded-xl font-black uppercase tracking-widest"
              disabled={loading}
            >
              {loading ? 'Validando...' : 'Iniciar Sesión'}
            </Button>
            
            <button 
              type="button" 
              onClick={onClose} 
              className="text-gray-500 hover:text-purple-400 text-[10px] font-bold uppercase tracking-widest transition-colors py-2"
            >
              Olvidé mi contraseña
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL DE NOTIFICACIÓN REUTILIZABLE */}
      <NotificationModal
        isOpen={notif.open}
        title={notif.title}
        message={notif.message}
        type={notif.type}
        onClose={() => setNotif({ ...notif, open: false })}
      />
    </>
  );
};

export default LoginModal;