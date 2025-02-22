import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="text-6xl text-red-500 mb-8">
          <span className="font-bold">¡Oops!</span> 🎬
        </div>
        
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
          Ha ocurrido un error
        </h1>
        
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 mb-8">
          <p className="text-[var(--text-secondary)] text-lg mb-4">
            {error?.message || "Algo salió mal mientras cargábamos esta página."}
          </p>
          <p className="text-[var(--text-secondary)] text-sm">
            Error: {error?.statusText || error?.message}
          </p>
        </div>

        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg
                     hover:bg-[var(--button-hover)] transition-colors duration-200 text-lg"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
