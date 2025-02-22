import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import { movieService } from '../services/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const userFavorites = await movieService.getUserFavorites();
        // Transformar los datos para que coincidan con el formato esperado por MovieCard
        const formattedFavorites = userFavorites.map(movie => ({
          id: movie.tmdbId,
          title: movie.title,
          poster_path: movie.posterPath,
          backdrop_path: movie.backdropPath,
          overview: movie.overview,
          release_date: movie.releaseDate,
          vote_average: movie.voteAverage
        }));
        setFavorites(formattedFavorites || []);
      } catch (err) {
        setError('Error al cargar los favoritos');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const handleToggleFavorite = async (movieId) => {
    try {
      await movieService.toggleFavorite(movieId);
      // Actualizar el estado local después de quitar de favoritos
      setFavorites(prev => prev.filter(movie => movie.id !== movieId));
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Error al actualizar favoritos');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
        <div className="max-w-7xl mx-auto px-4 py-8 w-full">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8 text-center">
            Mis Películas Favoritas
          </h1>

          <div className="text-[var(--text-primary)] text-center">Cargando favoritos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
        <div className="max-w-7xl mx-auto px-4 py-8 w-full">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8 text-center">
            Mis Películas Favoritas
          </h1>

          <div className="text-red-500 text-center">{error}</div>
        </div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
        <div className="max-w-7xl mx-auto px-4 py-8 w-full">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8 text-center">
            Mis Películas Favoritas
          </h1>

          <div className="text-[var(--text-secondary)] text-center">
            No tienes películas favoritas aún
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8 text-center">
          Mis Películas Favoritas
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={true}
              onFavoriteToggle={() => handleToggleFavorite(movie.id)}
              imageBaseUrl="https://image.tmdb.org/t/p/w500"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;