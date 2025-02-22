import { usePokemon } from '../context/PokemonContext'
import PokemonCard from '../components/PokemonCard'
import { Link } from 'react-router-dom'

const Favorites = () => {
  const { favorites } = usePokemon()

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-8 text-white">Mis Pokémon Favoritos</h1>
        <div className="bg-gray-700 rounded-lg p-8 max-w-2xl mx-auto">
          <p className="text-white text-xl mb-4">
            No tienes ningún Pokémon en favoritos
          </p>
          <p className="text-gray-300 mb-6">
            Añade algunos Pokémon a favoritos para verlos aquí
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Explorar Pokémon
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        Mis Pokémon Favoritos ({favorites.length})
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {favorites.map((favorite) => (
          <PokemonCard key={favorite.pokemon.id} pokemon={favorite.pokemon} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Explorar más Pokémon
        </Link>
      </div>
    </div>
  )
}

export default Favorites