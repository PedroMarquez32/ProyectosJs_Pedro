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
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8 text-center">
          Mis Reseñas
        </h1>

        {reviews.length === 0 ? (
          <div className="bg-[var(--bg-secondary)] rounded-lg p-8 text-center shadow-lg">
            <p className="text-[var(--text-secondary)]">No has escrito ninguna reseña aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="flex gap-6 bg-[var(--bg-secondary)] rounded-lg overflow-hidden shadow-lg"
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w500${review.movie.posterPath}`} 
                  alt={review.movie.title}
                  className="w-48 h-auto object-cover"
                />
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                        {review.movie.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= review.rating ? "text-yellow-400" : "text-[var(--text-secondary)]"}>
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">
                          • {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar reseña"
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                  <p className="text-[var(--text-secondary)]">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;