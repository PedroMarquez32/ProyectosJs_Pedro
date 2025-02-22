import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';
import { MdDelete } from 'react-icons/md';
import { motion } from 'framer-motion';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const userReviews = await movieService.getUserReviews();
      setReviews(userReviews);
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
      setError('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        await movieService.deleteReview(reviewId);
        setReviews(reviews.filter(review => review._id !== reviewId));
      } catch (error) {
        console.error('Error al eliminar la reseña:', error);
        setError('Error al eliminar la reseña');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando reseñas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Mis Reseñas
        </h1>

        {reviews.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-300">No has escrito ninguna reseña aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="flex">
                  {/* Póster de la película */}
                  <Link 
                    to={`/movie/${review.movie.tmdbId}`}
                    className="w-1/3 flex-shrink-0"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${review.movie.posterPath}`}
                      alt={review.movie.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-movie.jpg';
                      }}
                    />
                  </Link>

                  {/* Contenido de la reseña */}
                  <div className="w-2/3 p-6 relative">
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 
                               transition-colors p-2"
                      title="Eliminar reseña"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>

                    <Link 
                      to={`/movie/${review.movie.tmdbId}`}
                      className="text-xl font-bold text-white hover:text-blue-400 transition-colors block mb-2"
                    >
                      {review.movie.title}
                    </Link>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-gray-300 line-clamp-4">{review.comment}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;