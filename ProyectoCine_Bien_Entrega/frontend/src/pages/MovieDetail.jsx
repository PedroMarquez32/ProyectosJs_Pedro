import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PacmanLoader } from "react-spinners";
import { useFetch } from "../hooks/useFetch";
import { movieService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { MdDelete } from 'react-icons/md';
import { FaStar } from 'react-icons/fa';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useTheme } from '../context/ThemeContext';

const MovieDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviews, setReviews] = useState([]);
  const { theme } = useTheme();

  const { data: movie, loading, error } = useFetch(
    () => movieService.getMovieDetails(id),
    [id]
  );

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (user) {
        try {
          const userData = await movieService.getUserFavorites();
          setIsFavorite(userData.some(fav => fav.tmdbId === Number(id)));
        } catch (error) {
          console.error('Error al verificar favoritos:', error);
        }
      }
    };

    const fetchReviews = async () => {
      try {
        const movieReviews = await movieService.getMovieReviews(id);
        setReviews(movieReviews);
      } catch (error) {
        console.error('Error al cargar reseñas:', error);
      }
    };

    checkIfFavorite();
    fetchReviews();
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user) return;
    
    try {
      await movieService.toggleFavorite(id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const newReview = await movieService.addReview(id, reviewForm);
      setReviews([newReview, ...reviews]);
      setReviewForm({ rating: 5, comment: "" });
    } catch (error) {
      console.error('Error al enviar reseña:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        await movieService.deleteReview(reviewId);
        setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
      } catch (error) {
        console.error('Error al eliminar la reseña:', error);
        alert('Error al eliminar la reseña');
      }
    }
  };

  const getTrailerKey = (videos) => {
    if (!videos || !videos.results) return null;

    const trailer = videos.results.find(
      video => video.type === "Trailer" && video.site === "YouTube"
    );

    return trailer ? trailer.key : videos.results[0]?.key;
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
            className={`text-2xl ${
              star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-400'
            } hover:text-yellow-300 transition-colors`}
          >
            <FaStar />
          </button>
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <PacmanLoader color="#60a5fa" />
    </div>
  );

  if (error) return <div className="text-center text-red-600">Error al cargar la película</div>;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="relative h-[85vh] overflow-hidden">
        <img
          src={movie?.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '/placeholder-backdrop.jpg'}
          alt={movie?.title}
          className="w-full h-full object-cover object-top"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${
          theme === 'dark'
            ? 'from-[#111827] via-[#111827]/50 to-transparent'
            : 'from-gray-800/90 via-gray-800/40 to-transparent'
        }`} />
        
        <div className="absolute bottom-0 left-0 right-0 px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-6xl font-bold mb-4 text-white">
              {movie?.title}
            </h1>
            <div className="flex items-center gap-4 text-lg text-white">
              <span>{movie?.release_date?.split('-')[0]}</span>
              <span>•</span>
              <span>{movie?.runtime} min</span>
              <span>•</span>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">⭐</span>
                <span>{movie?.vote_average?.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col text-[var(--text-primary)]">
            <div className="container mx-auto px-6 pt-6">
              <div className="flex gap-8">
                <div className="w-[400px] flex-shrink-0">
                  <img 
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
                    alt={movie.title}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">{movie.title}</h1>
                  <div className="flex gap-2 mb-4">
                    {movie.genres?.map(genre => (
                      <span 
                        key={genre.id} 
                        className="bg-blue-600 px-3 py-1 rounded-full text-white text-sm hover:bg-blue-700 transition-colors"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl mb-4 text-[var(--text-primary)]">Sinopsis</h2>
                  <p className="text-[var(--text-secondary)] mb-6">{movie.overview}</p>
                  
                  <button 
                    onClick={handleToggleFavorite}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg 
                             flex items-center gap-2 mb-8 transition duration-300"
                  >
                    {isFavorite ? (
                      <>
                        <HeartIconSolid className="w-5 h-5 text-red-500" />
                        Quitar de favoritos
                      </>
                    ) : (
                      <>
                        <HeartIconOutline className="w-5 h-5" />
                        Añadir a favoritos
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-6 mt-8">
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Detalles de producción</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)]">Presupuesto:</span>
                          <span className="text-[var(--text-primary)]">${movie.budget?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)]">Recaudación:</span>
                          <span className="text-[var(--text-primary)]">${movie.revenue?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)]">Estado:</span>
                          <span className="text-[var(--text-primary)]">{movie.status}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)]">Idioma original:</span>
                          <span className="text-[var(--text-primary)]">{movie.original_language?.toUpperCase() || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Estadísticas</h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-[var(--text-secondary)]">Popularidad</span>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min((movie.popularity || 0) / 1000 * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className="text-[var(--text-secondary)]">Valoración media</span>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-[var(--text-primary)]">{movie.vote_average?.toFixed(1) || 0}/10</span>
                            <span className="text-gray-400">({movie.vote_count || 0} votos)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {movie.videos?.results?.length > 0 && (
                <div className="mt-12 mb-8">
                  <h2 className="text-2xl mb-4 text-[var(--text-primary)]">Trailer</h2>
                  <div className="w-[800px] mx-auto">
                    <iframe
                      className="w-full aspect-video rounded-lg"
                      src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="w-full max-w-6xl mx-auto mt-12 mb-8 px-6">
              <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Reseñas</h2>
              
              <div className="bg-[var(--bg-secondary)] p-8 rounded-lg mb-8">
                <h3 className="text-xl mb-6 text-[var(--text-primary)]">Escribe una reseña</h3>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[var(--text-secondary)] mb-2">Puntuación</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="text-2xl hover:scale-110 transition-transform"
                        >
                          {star <= reviewForm.rating ? "⭐" : "☆"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[var(--text-secondary)] mb-2">Comentario</label>
                    <textarea
                      className="w-full bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg p-4 min-h-[120px]"
                      placeholder="Escribe tu opinión sobre la película..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />
                  </div>

                  <div className="col-span-2">
                    <button 
                      onClick={handleSubmitReview}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300"
                    >
                      Publicar reseña
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-[var(--bg-secondary)] p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-secondary)] font-semibold">{review.user.username}</span>
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <span key={i} className="text-yellow-400">⭐</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[var(--text-secondary)] line-clamp-3">{review.comment}</p>
                  </div>
                ))}
              </div>

              {reviews.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  No hay reseñas todavía. ¡Sé el primero en opinar!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
