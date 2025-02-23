const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
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
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const favorites = await Favorite.find({ user: req.user.id })
      .populate('movie');
    
    const formattedFavorites = favorites.map(fav => ({
      tmdbId: fav.movie.tmdbId,
      title: fav.movie.title,
      posterPath: fav.movie.posterPath,
      backdropPath: fav.movie.backdropPath,
      overview: fav.movie.overview,
      releaseDate: fav.movie.releaseDate,
      voteAverage: fav.movie.voteAverage
    }));

    res.json(formattedFavorites);
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
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
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { movieId } = req.body;
    const userId = req.user.id;

    let movie = await Movie.findOne({ tmdbId: movieId });
    
    if (!movie) {
      // Si la película no existe en nuestra base de datos, obtenerla de TMDB
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
        voteAverage: movieData.vote_average
      });
    }

    const existingFavorite = await Favorite.findOne({ 
      user: userId, 
      movie: movie._id 
    });

    if (existingFavorite) {
      await Favorite.findByIdAndDelete(existingFavorite._id);
      res.json({ message: 'Película eliminada de favoritos', isFavorite: false });
    } else {
      await Favorite.create({ user: userId, movie: movie._id });
      res.json({ message: 'Película añadida a favoritos', isFavorite: true });
    }
  } catch (error) {
    console.error('Error al actualizar favoritos:', error);
    res.status(500).json({ message: 'Error al actualizar favoritos' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;
    const userId = req.user.id;

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

    const review = new Review({
      user: userId,
      movie: movie._id,
      rating,
      comment
    });

    await review.save();

    if (!movie.reviews.includes(review._id)) {
      movie.reviews.push(review._id);
      await movie.save();
    }

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

    await Movie.findByIdAndUpdate(review.movie, {
      $pull: { reviews: review._id }
    });

    await review.deleteOne();

    res.json({ message: 'Reseña eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la reseña:', error);
    res.status(500).json({ message: 'Error al eliminar la reseña' });
  }
};