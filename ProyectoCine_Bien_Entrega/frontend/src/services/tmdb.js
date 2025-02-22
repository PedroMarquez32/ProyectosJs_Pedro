const VITE_API_TOKEN = import.meta.env.VITE_API_TOKEN;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_BASE_IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;


export const IMAGES_SIZES = {
  POSTER: "w500",
  BACKDROP: "original",
};


export const getImageUrl = (path, size = IMAGES_SIZES.POSTER) => {
  if (!path) return "/placeholder-movie.jpg";
  return `${VITE_BASE_IMAGE_URL}/${size}${path}`;
};

const fetchFromAPI = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    api_key: VITE_API_TOKEN,
    language: 'es-ES',
    ...params
  });

  const response = await fetch(`${VITE_BASE_URL}${endpoint}?${queryParams}`);
  if (!response.ok) {
    throw new Error('Error en la petición a la API');
  }
  return response.json();
};


export const getMoviesByCategory = async (category, page = 1) => {
  const endpoints = {
    popular: '/movie/popular',
    top_rated: '/movie/top_rated',
    now_playing: '/movie/now_playing'
  };
  
  return fetchFromAPI(endpoints[category], { page });
};


export const getMovieGenres = async () => {
  return fetchFromAPI('/genre/movie/list');
};


export const getPopularMovies = (page = 1) => {
  return getMoviesByCategory('popular', page);
};



export const getMovieDetails = async (movieId) => {
  try {
    const [detailsResponse, videosResponse] = await Promise.all([
      fetch(`${VITE_BASE_URL}/movie/${movieId}`, {
        headers: {
          'Authorization': `Bearer ${VITE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }),
      getMovieVideos(movieId)
    ]);

    const movieDetails = await detailsResponse.json();
    
    return {
      ...movieDetails,
      trailer: videosResponse
    };
  } catch (error) {
    console.error('Error al obtener detalles de la película:', error);
    throw error;
  }
};



export const searchMovies = async (query, page = 1) => {
  return fetchFromAPI("/search/movie", { query, page });
};

export const getMovieVideos = async (movieId) => {
  try {
    const response = await fetch(
      `${VITE_BASE_URL}/movie/${movieId}/videos`,
      {
        headers: {
          'Authorization': `Bearer ${VITE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const data = await response.json();
    
    
    const videos = data.results.filter(video => {
      return (
        (video.type === 'Trailer' || video.type === 'Teaser') &&
        video.site === 'YouTube'
      );
    });

    
    const spanishTrailer = videos.find(video => video.iso_639_1 === 'es');
    const englishTrailer = videos.find(video => video.iso_639_1 === 'en');
    
    return spanishTrailer || englishTrailer || videos[0] || null;
  } catch (error) {
    console.error('Error al obtener videos:', error);
    return null;
  }
};
