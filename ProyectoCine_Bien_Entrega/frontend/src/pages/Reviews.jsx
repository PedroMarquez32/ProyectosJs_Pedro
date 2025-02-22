import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';
import { MdDelete } from 'react-icons/md';

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
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Mis Reseñas</h1>
        </header>

        {reviews.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-300">No has escrito ninguna reseña aún.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="bg-gray-800 p-6 rounded-lg shadow-md relative group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow pr-10">
                    <Link 
                      to={`/movie/${review.movie.tmdbId}`}
                      className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
                    >
                      {review.movie.title}
                    </Link>
                    <div className="flex items-center mt-2">
                      <div className="text-amber-400">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                      <span className="text-gray-400 ml-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-300">{review.comment}</p>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 
                             transition-colors p-2"
                    title="Eliminar reseña"
                  >
                    <MdDelete className="w-5 h-5" />
                  </button>
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