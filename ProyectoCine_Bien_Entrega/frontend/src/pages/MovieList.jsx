import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMoviesByCategory, getMovieGenres } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { PacmanLoader } from 'react-spinners';

const MovieList = () => {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [genres, setGenres] = useState([]);
  const [ratingRange, setRatingRange] = useState(0);

  // Cargar películas cuando cambie la página o categoría
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await getMoviesByCategory(selectedCategory, page);
        
        let filteredMovies = data.results;
        
        // Aplicar filtros si es necesario
        if (ratingRange > 0) {
          filteredMovies = filteredMovies.filter(movie => 
            movie.vote_average >= ratingRange
          );
        }

        if (selectedGenre !== 'all') {
          filteredMovies = filteredMovies.filter(movie => 
            movie.genre_ids.includes(parseInt(selectedGenre))
          );
        }

        setMovies(filteredMovies);
      } catch (error) {
        console.error('Error cargando películas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [page, selectedCategory, selectedGenre, ratingRange]);

  // Cargar géneros
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getMovieGenres();
        setGenres(genreData.genres);
      } catch (err) {
        console.error('Error al cargar géneros:', err);
      }
    };
    fetchGenres();
  }, []);

  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(newPage);
  };

  // Resto del código del componente (filtros, UI, etc.)
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Películas Populares
        </h1>

        {/* Filtros */}
        <div className="mb-8 space-y-6">
          {/* Selector de categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 text-white rounded-lg p-2 border border-gray-700"
            >
              <option value="popular">Más Populares</option>
              <option value="top_rated">Mejor Valoradas</option>
              <option value="now_playing">Más Recientes</option>
            </select>

            {/* Selector de género */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-gray-800 text-white rounded-lg p-2 border border-gray-700"
            >
              <option value="all">Todos los géneros</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Slider de valoración mejorado */}
          <div className="rating-slider-container">
            <div className="rating-header">
              <span>Valoración: {ratingRange.toFixed(1)}</span>
              <span className="rating-star">★</span>
            </div>
            
            <div className="rating-track">
              <div
                className="rating-range"
                style={{
                  width: `${(ratingRange * 10)}%`
                }}
              />
              
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={ratingRange}
                onChange={(e) => setRatingRange(parseFloat(e.target.value))}
                className="rating-input"
              />
            </div>

            <div className="rating-marks">
              {[0, 2.5, 5, 7.5, 10].map((value) => (
                <div 
                  key={value} 
                  className="rating-mark"
                  onClick={() => setRatingRange(value)}
                >
                  <div className="rating-mark-tick" />
                  <span className="rating-mark-label">
                    {value}
                    <span className="rating-star">★</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="text-white mb-4 text-center">
          Mostrando {movies.length} de {movies.length} películas
        </div>

        {/* Lista de películas */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </motion.div>

        {/* Paginación */}
        <div className="flex justify-center gap-4 mt-8 mb-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <span className="px-4 py-2 bg-gray-700 text-white rounded-lg">
            Página {page}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Siguiente
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <PacmanLoader color="#3b82f6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;