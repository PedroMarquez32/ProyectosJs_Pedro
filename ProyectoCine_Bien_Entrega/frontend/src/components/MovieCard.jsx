import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { movieService } from '../services/api';

const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (user) {
        try {
          const userData = await movieService.getUserFavorites();
          setIsFavorite(userData.some(fav => fav.tmdbId === movie.id));
        } catch (error) {
          console.error('Error al verificar favoritos:', error);
        }
      }
    };

    if (user) {
      checkIfFavorite();
    }
  }, [user, movie.id]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Prevenir la navegación
    e.stopPropagation(); // Prevenir la propagación del evento
    
    if (!user) return;

    try {
      await movieService.toggleFavorite(movie.id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    }
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-900">
          {/* Botón de favoritos - Ahora siempre visible */}
          {user && (
            <button
              onClick={handleToggleFavorite}
              className="absolute top-3 left-3 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300 transform hover:scale-110"
              title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <span className={`text-2xl transition-transform duration-300 ${isFavorite ? 'scale-110' : 'scale-100'}`}>
                {isFavorite ? '❤️' : '🤍'}
              </span>
            </button>
          )}

          {/* Imagen del poster */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-[400px] object-cover transform transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = '/placeholder-movie.jpg';
            }}
          />

          {/* Overlay con información */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-xl font-bold mb-2 line-clamp-2">
                {movie.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </span>
                <span>•</span>
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>

              <p className="text-sm line-clamp-3 text-gray-300">
                {movie.overview}
              </p>

              <motion.div
                className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-full text-sm font-medium hover:bg-sky-700 transition-colors inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver detalles
              </motion.div>
            </div>
          </div>

          {/* Badge de puntuación */}
          <div className="absolute top-2 right-2 bg-sky-600 text-white px-2 py-1 rounded-full text-sm font-medium">
            ⭐ {movie.vote_average?.toFixed(1)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
