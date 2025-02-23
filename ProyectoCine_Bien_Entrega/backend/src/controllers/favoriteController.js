const User = require('../models/User');
const Movie = require('../models/Movie');
const Favorite = require('../models/Favorite');

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await Favorite.find({ user: userId })
      .populate('movie');
    
    res.json({
      favorites: favorites.map(fav => fav.movie) || []
    });
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    res.status(500).json({ message: 'Error al obtener los favoritos' });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = req.body.movieId;
    
    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    await Favorite.findOneAndUpdate(
      { user: userId, movie: movie._id },
      { user: userId, movie: movie._id },
      { upsert: true, new: true }
    );
    
    res.json({ message: 'Película añadida a favoritos' });
  } catch (error) {
    console.error('Error al añadir favorito:', error);
    res.status(500).json({ message: 'Error al añadir a favoritos' });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = req.params.movieId;
    
    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    await Favorite.findOneAndDelete({ user: userId, movie: movie._id });
    
    res.json({ message: 'Película eliminada de favoritos' });
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    res.status(500).json({ message: 'Error al eliminar de favoritos' });
  }
}; 