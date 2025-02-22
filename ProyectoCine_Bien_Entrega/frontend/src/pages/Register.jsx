import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="bg-[var(--bg-secondary)] p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">
          Registro
        </h2>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[var(--text-secondary)] mb-2" htmlFor="username">
              Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full p-2 rounded bg-[var(--input-bg)] text-[var(--text-primary)] 
                       border border-[var(--border-color)] focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-[var(--text-secondary)] mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 rounded bg-[var(--input-bg)] text-[var(--text-primary)] 
                       border border-[var(--border-color)] focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-[var(--text-secondary)] mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 rounded bg-[var(--input-bg)] text-[var(--text-primary)] 
                       border border-[var(--border-color)] focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-[var(--text-secondary)] mb-2" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full p-2 rounded bg-[var(--input-bg)] text-[var(--text-primary)] 
                       border border-[var(--border-color)] focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg 
                     hover:bg-[var(--button-hover)] transition-colors"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register; 