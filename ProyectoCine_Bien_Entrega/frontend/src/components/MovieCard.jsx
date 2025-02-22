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
    e.preventDefault(); 
    e.stopPropagation(); 
    
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
        <div className="relative overflow-hidden rounded-lg shadow-lg bg-[var(--card-bg)]">
          {user && (
            <button
              onClick={handleToggleFavorite}
              className="absolute top-3 left-3 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 
                       transition-all duration-300"
              title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <span className={`text-2xl ${isFavorite ? 'scale-110' : 'scale-100'}`}>
                {isFavorite ? '❤️' : '🤍'}
              </span>
            </button>
          )}

          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-[400px] object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-movie.jpg';
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white mb-2">{movie.title}</h3>
              <p className="text-sm text-gray-200 line-clamp-2">
                {movie.overview}
              </p>
              <div className="flex items-center mt-2 text-gray-200">
                <span className="flex items-center">
                  <span className="text-yellow-400 mr-1">⭐</span>
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="mx-2">•</span>
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
