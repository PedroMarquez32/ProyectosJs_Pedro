const Movie = require('../models/Movie');
const fetch = require('node-fetch');

exports.getPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=es-ES&page=${page}`
    );
    const data = await response.json();

    // Guardamos o actualizamos las películas en nuestra BD
    const movies = await Promise.all(
      data.results.map(async (movie) => {
        const movieData = {
          tmdbId: movie.id,
          title: movie.title,
          overview: movie.overview,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          releaseDate: movie.release_date,
          voteAverage: movie.vote_average
        };

        return await Movie.findOneAndUpdate(
          { tmdbId: movie.id },
          movieData,
          { upsert: true, new: true }
        );
      })
    );

    res.json({
      results: movies,
      page: parseInt(page),
      total_pages: data.total_pages
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener películas populares' });
  }
};

exports.getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener detalles básicos de la película
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=es-ES`
    );
    const movieData = await movieResponse.json();

    // Obtener videos (trailers)
    const videosResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=es-ES`
    );
    const videosData = await videosResponse.json();

    // Guardar o actualizar la película en nuestra base de datos
    await Movie.findOneAndUpdate(
      { tmdbId: parseInt(id) },
      {
        tmdbId: parseInt(id),
        title: movieData.title,
        overview: movieData.overview,
        posterPath: movieData.poster_path,
        backdropPath: movieData.backdrop_path,
        releaseDate: movieData.release_date,
        voteAverage: movieData.vote_average
      },
      { upsert: true, new: true }
    );

    // Combinar los datos
    const movie = {
      ...movieData,
      videos: videosData
    };

    res.json(movie);
  } catch (error) {
    console.error('Error al obtener detalles de la película:', error);
    res.status(500).json({ message: 'Error al obtener detalles de la película' });
  }
};

exports.getMovieReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findOne({ tmdbId: id })
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'username' }
      });

    if (!movie) {
      return res.json([]);
    }

    res.json(movie.reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reseñas' });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Se requiere un término de búsqueda' });
    }

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=1&include_adult=false`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TMDB API respondió con status: ${response.status}`);
    }

    const data = await response.json();
    
    // Asegurarse de que la respuesta tenga el formato correcto
    if (!data.results) {
      throw new Error('Formato de respuesta inválido de TMDB');
    }

    // Transformar los resultados para asegurar la estructura correcta
    const formattedResults = data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids
    }));

    res.json({
      results: formattedResults,
      total_results: data.total_results,
      page: data.page,
      total_pages: data.total_pages
    });

  } catch (error) {
    console.error('Error en searchMovies:', error);
    res.status(500).json({ 
      message: 'Error al buscar películas',
      error: error.message 
    });
  }
};