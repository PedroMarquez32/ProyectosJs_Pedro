const User = require('../models/User');

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('favorites');
    
    res.json({
      favorites: user.favorites || []
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
    
    const user = await User.findById(userId);
    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }
    
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
    
    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(id => id.toString() !== movieId);
    await user.save();
    
    res.json({ message: 'Película eliminada de favoritos' });
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    res.status(500).json({ message: 'Error al eliminar de favoritos' });
  }
}; 