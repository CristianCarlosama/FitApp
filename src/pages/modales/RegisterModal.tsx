import React, { useState } from 'react';
import axios from 'axios';
import Button from '../../components/Buttons';
import Text from '../../components/Texts';
import Input from '../../components/Inputs';
import Modal from '../../components/Modal'; // Usando el componente reutilizable
import { FaUserPlus } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Medidas {
  peso?: string; pecho?: string; cintura?: string;
  pierna?: string; pantorrilla?: string; brazo?: string; espalda?: string;
}

const RegisterModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    nombres: '', apellidos: '', usuario: '',
    correo: '', password: '', confirmPassword: '',
    medidas: {} as Medidas,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Lógica original de medidas y campos principales
    if (name in form.medidas) {
      setForm((prev) => ({
        ...prev,
        medidas: { ...prev.medidas, [name]: value },
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const medidasFiltered = Object.fromEntries(
      Object.entries(form.medidas).filter(([_, v]) => v && v.trim() !== '')
    );

    const payload = {
      nombres: form.nombres,
      apellidos: form.apellidos,
      usuario: form.usuario,
      email: form.correo,
      password: form.password,
      password_confirmation: form.confirmPassword,
      medidas: medidasFiltered,
    };

    try {
      const res = await axios.post(`${API_URL}/register`, payload);
      console.log('Usuario registrado:', res.data);
      alert('Usuario registrado con éxito');
      onClose();
    } catch (error: any) {
      console.error('Error al registrar:', error.response?.data || error.message);
      alert('Error al registrar: ' + (error.response?.data?.error || 'Revise la consola'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registro de Atleta">
      {/* Icono y cabecera pequeña */}
      <div className="flex flex-col items-center mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center mb-2">
          <FaUserPlus className="text-white text-lg" />
        </div>
        <Text size="sm" variant="muted">Completa tus datos para empezar</Text>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Sección Datos Cuenta */}
        <div className="space-y-3">
          <Text size="xs" weight="bold" variant="muted" className="uppercase tracking-widest border-l-2 border-purple-500 pl-2">
            Cuenta
          </Text>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nombres" name="nombres" size="sm" value={form.nombres} onChange={handleChange} required />
            <Input label="Apellidos" name="apellidos" size="sm" value={form.apellidos} onChange={handleChange} required />
            <Input label="Usuario" name="usuario" size="sm" value={form.usuario} onChange={handleChange} required />
            <Input label="Correo" name="correo" type="email" size="sm" value={form.correo} onChange={handleChange} required />
            <Input label="Contraseña" name="password" type="password" size="sm" value={form.password} onChange={handleChange} required />
            <Input label="Confirmar" name="confirmPassword" type="password" size="sm" value={form.confirmPassword} onChange={handleChange} required />
          </div>
        </div>

        {/* Sección Medidas Compacta (3 columnas) */}
        <div className="space-y-3">
          <Text size="xs" weight="bold" variant="muted" className="uppercase tracking-widest border-l-2 border-blue-500 pl-2">
            Medidas
          </Text>
          <div className="grid grid-cols-3 gap-2">
            {['peso','pecho','cintura','pierna','pantorrilla','brazo','espalda'].map((medida) => (
              <Input
                key={medida}
                name={medida}
                label={medida}
                placeholder="0"
                type="number"
                size="sm"
                value={form.medidas[medida as keyof Medidas] || ''}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="pt-2">
          <Button type="submit" variant="primary" size="md" className="w-full !rounded-xl">
            Registrar Perfil
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterModal;