const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const fetch = require('node-fetch');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('favorites');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil de usuario' });
  }
};

exports.getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener favoritos' });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('movie')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reseñas' });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.id;

    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    const user = await User.findById(userId);
    const movieIndex = user.favorites.indexOf(movie._id);

    if (movieIndex === -1) {
      user.favorites.push(movie._id);
      await user.save();
      res.json({ message: 'Película añadida a favoritos' });
    } else {
      user.favorites.splice(movieIndex, 1);
      await user.save();
      res.json({ message: 'Película eliminada de favoritos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar favoritos' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;
    const userId = req.user.id;

    // Buscar o crear la película
    let movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=es-ES`
        );
        const movieData = await response.json();

        movie = await Movie.create({
          tmdbId: movieId,
          title: movieData.title,
          posterPath: movieData.poster_path,
          backdropPath: movieData.backdrop_path,
          overview: movieData.overview,
          releaseDate: movieData.release_date,
          reviews: []
        });
      } catch (error) {
        console.error('Error al obtener datos de TMDB:', error);
        return res.status(500).json({ message: 'Error al obtener datos de la película' });
      }
    }

    // Crear la nueva reseña
    const review = new Review({
      user: userId,
      movie: movie._id,
      rating,
      comment
    });

    await review.save();

    // Añadir la reseña a la película si no existe ya
    if (!movie.reviews.includes(review._id)) {
      movie.reviews.push(review._id);
      await movie.save();
    }

    // Poblar los datos del usuario para la respuesta
    await review.populate('user', 'username');
    
    res.status(201).json(review);
  } catch (error) {
    console.error('Error al crear la reseña:', error);
    res.status(500).json({ message: 'Error al crear la reseña' });
  }
};

exports.getMovieReviews = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findOne({ tmdbId: movieId })
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'username' }
      });

    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    res.json(movie.reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reseñas' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    // Eliminar la referencia de la reseña en la película
    await Movie.findByIdAndUpdate(review.movie, {
      $pull: { reviews: review._id }
    });

    // Eliminar la reseña
    await review.deleteOne();

    res.json({ message: 'Reseña eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la reseña:', error);
    res.status(500).json({ message: 'Error al eliminar la reseña' });
  }
};