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


  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await getMoviesByCategory(selectedCategory, page);
        
        let filteredMovies = data.results;
        

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


  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8 text-center">
          Películas Populares
        </h1>


        <div className="mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-[var(--text-secondary)] mb-2">
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)]
                         border border-[var(--border-color)] focus:border-blue-500 focus:outline-none
                         appearance-none cursor-pointer shadow-sm"
              >
                <option value="popular" className="bg-[var(--input-bg)]">Más Populares</option>
                <option value="top_rated" className="bg-[var(--input-bg)]">Mejor Valoradas</option>
                <option value="now_playing" className="bg-[var(--input-bg)]">Más Recientes</option>
              </select>
              <div className="absolute right-3 top-[calc(50%+0.5rem)] pointer-events-none text-[var(--text-secondary)]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M7 10l5 5 5-5H7z"/>
                </svg>
              </div>
            </div>

            <div className="relative">
              <label className="block text-[var(--text-secondary)] mb-2">
                Género
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full p-3 rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)]
                         border border-[var(--border-color)] focus:border-blue-500 focus:outline-none
                         appearance-none cursor-pointer shadow-sm"
              >
                <option value="all" className="bg-[var(--input-bg)]">Todos los géneros</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id} className="bg-[var(--input-bg)]">
                    {genre.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-[calc(50%+0.5rem)] pointer-events-none text-[var(--text-secondary)]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M7 10l5 5 5-5H7z"/>
                </svg>
              </div>
            </div>
          </div>


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


        <div className="text-white mb-4 text-center">
          Mostrando {movies.length} de {movies.length} películas
        </div>


        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </motion.div>


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