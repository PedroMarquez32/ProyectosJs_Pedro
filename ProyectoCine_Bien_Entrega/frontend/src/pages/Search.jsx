import { useState } from 'react';
import { searchMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { FaSearch } from 'react-icons/fa';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const data = await searchMovies(searchTerm);
      setMovies(data.results || []);
    } catch (error) {
      console.error('Error al buscar películas:', error);
      setError('Error al buscar películas. Por favor, inténtalo de nuevo.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8 text-center">
          Buscar Películas
        </h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="max-w-2xl mx-auto flex gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar películas..."
              className="flex-1 p-3 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] 
                       border border-[var(--border-color)] shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors duration-200 shadow-sm"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Estado de carga */}
        {loading && (
          <div className="text-center text-white text-xl">
            Buscando películas...
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="text-center text-red-500 mb-8">
            {error}
          </div>
        )}

        {/* Resultados */}
        {!loading && !error && movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* Mensaje cuando no hay resultados */}
        {!loading && !error && searchTerm && movies.length === 0 && (
          <div className="text-center text-gray-400 text-xl">
            No se encontraron películas que coincidan con tu búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;