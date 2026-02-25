import React, { useState, useEffect } from 'react'; // Importamos useEffect
import { login } from '../../services/auth';
import Button from '../../components/Buttons';
import Text from '../../components/Texts';
import Input from '../../components/Inputs';
import Modal from '../../components/Modal';
import { FaLock } from 'react-icons/fa';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<Props> = ({ isOpen, onClose, onLoginSuccess }) => {
  // Estado inicial limpio
  const initialState = { login: '', password: '' };
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // 🔥 Este es el truco: Limpiar cuando el modal se cierra
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
      localStorage.setItem('user', JSON.stringify(res.user)); // 🔹 importante para el rol

      if (onLoginSuccess) onLoginSuccess();
      alert('🔥 Login exitoso');
      onClose();
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert('❌ Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
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
            autoComplete="off" // Evita que el navegador sugiera cosas viejas
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
            className="w-full !rounded-xl"
            disabled={loading}
          >
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </Button>
          
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-300 text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Olvidé mi contraseña
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;