import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(credentials);
      navigate('/'); // Redirigir al home después del login exitoso
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="bg-[var(--bg-secondary)] p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">
          Iniciar Sesión
        </h2>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[var(--text-secondary)] mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 rounded bg-[var(--input-bg)] text-[var(--text-primary)] 
                       border border-[var(--border-color)] focus:border-blue-500 focus:outline-none"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-[var(--text-secondary)] mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 rounded bg-[var(--input-bg)] text-[var(--text-primary)] 
                       border border-[var(--border-color)] focus:border-blue-500 focus:outline-none"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg 
                     hover:bg-[var(--button-hover)] transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 