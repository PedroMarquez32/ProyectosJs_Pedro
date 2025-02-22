import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaGithub, FaSun, FaMoon } from 'react-icons/fa';

const RootLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} flex flex-col`}>
      <nav className={`${theme === 'dark' ? 'bg-sky-900' : 'bg-sky-700'} text-white shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-sky-800 transition-colors mr-4"
                title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {theme === 'dark' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
              <NavLink 
                to="/" 
                className="text-lg font-bold hover:text-amber-400 transition-colors duration-300"
              >
                VideoClub
              </NavLink>
              <div className="flex space-x-4 ml-10">
                <NavLink to="/movies" className="hover:text-amber-600">
                  Películas
                </NavLink>
                <NavLink to="/search" className="hover:text-amber-600">
                  Buscar
                </NavLink>
                {user ? (
                  <>
                    <NavLink to="/favorites" className="hover:text-amber-600">
                      Favoritos
                    </NavLink>
                    <NavLink to="/reviews" className="hover:text-amber-600">
                      Reseñas
                    </NavLink>
                  </>
                ) : null}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-amber-400">{user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="hover:text-amber-600"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="hover:text-amber-600">
                    Iniciar Sesión
                  </NavLink>
                  <NavLink to="/register" className="hover:text-amber-600">
                    Registrarse
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className={`${theme === 'dark' ? 'bg-sky-900' : 'bg-sky-700'} text-white py-4`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p className="text-sm">
            © 2025 Pedro Javier Marquez Lizana
          </p>
          <a 
            href="https://github.com/PedroMarquez32" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-amber-400 transition-colors"
          >
            <FaGithub className="text-xl" />
            <span>PedroMarquez32</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
