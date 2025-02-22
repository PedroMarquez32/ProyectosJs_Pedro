import { Link, NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="sticky top-0 w-full z-50 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 shadow-lg border-b border-purple-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="text-white text-2xl font-bold hover:text-purple-300 transition-colors"
          >
            Pokédex
          </Link>

          <div className="flex space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-200 hover:bg-purple-700 hover:text-white'
                }`
              }
            >
              Inicio
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-200 hover:bg-purple-700 hover:text-white'
                }`
              }
            >
              Buscar
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-200 hover:bg-purple-700 hover:text-white'
                }`
              }
            >
              Favoritos
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-200 hover:bg-purple-700 hover:text-white'
                }`
              }
            >
              Acerca de
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar