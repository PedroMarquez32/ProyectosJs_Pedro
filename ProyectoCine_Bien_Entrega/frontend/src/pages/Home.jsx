import { useState } from "react";
import { Link } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import MovieCard from "../components/MovieCard";
import { useFetch } from "../hooks/useFetch";
import { getPopularMovies } from "../services/tmdb";
import { motion } from "framer-motion";

const Home = () => {
  // estado para el número de página
  const [page, setPage] = useState(1);
  // me traigo la data de las películas
  const { data, loading, error } = useFetch(
    () => getPopularMovies(page),
    [page]
  );

  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(newPage);
  };

  // si hay error cargando??
  if (error) {
    return (
      <div className="text-center p-10">
        <h2 className="text-red-600 text-2xl font-bold">
          Error al traer las películas
        </h2>
        <p className="text-xl font-medium">{error.message}</p>
        <Link to="/" className="text-blue-600">
          Volver al inicio
        </Link>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Bienvenido a Videoclub</h1>
        <p className="text-xl text-[var(--text-secondary)]">Descubre las películas más populares del momento</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-8 text-[var(--text-primary)]">Películas Populares</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {data?.results?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            className=" text-white px-4 py-2 rounded-lg transition-colors duration-200 bg-sky-800 hover:bg-sky-950"
            disabled={page === 1}
          >
            Anterior
          </button>
          <span></span>
          <button
            onClick={() => handlePageChange(page + 1)}
            className="text-white px-4 py-2 rounded-lg transition-colors duration-200 bg-sky-800 hover:bg-sky-950"
            disabled={page === data?.total_pages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
