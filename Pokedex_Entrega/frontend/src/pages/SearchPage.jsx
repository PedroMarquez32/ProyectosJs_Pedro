import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PokemonCard from '../components/PokemonCard'

const SearchPage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pokemon/${searchTerm.toLowerCase()}`)
      const data = await response.json()
      
      if (response.ok) {
        navigate(`/pokemon/${data.name.toLowerCase()}`)
      } else {
        const searchResponse = await fetch(`${import.meta.env.VITE_API_URL}/pokemon/search/${searchTerm}`)
        if (!searchResponse.ok) {
          throw new Error('Error en la búsqueda')
        }
        const results = await searchResponse.json()
        setSearchResults(results)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error al buscar Pokémon. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Buscar Pokémon</h1>
      
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre... (ej: Pikachu)"
            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-gray-700 text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            disabled={loading || !searchTerm.trim()}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-white">Buscando Pokémon...</div>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {searchResults.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      ) : searchTerm && !loading && (
        <div className="text-center text-white">
          No se encontraron Pokémon que coincidan con "{searchTerm}"
        </div>
      )}

      {!searchTerm && !searchResults.length && (
        <div className="text-center text-white">
          Ingresa el nombre de un Pokémon para comenzar la búsqueda
        </div>
      )}
    </div>
  )
}

export default SearchPage