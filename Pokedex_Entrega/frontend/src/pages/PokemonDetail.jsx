import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const PokemonDetail = () => {
  const { NAME } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAllMoves, setShowAllMoves] = useState(false)

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/pokemon/${NAME}`)
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Pokemon no encontrado' : 'Error al cargar el Pokemon')
        }
        
        const data = await response.json()
        setPokemon(data)
      } catch (err) {
        console.error('Error fetching pokemon:', err)
        setError(err.message || 'Error al cargar el Pokemon')
      } finally {
        setLoading(false)
      }
    }

    if (NAME) {
      fetchPokemon()
    }
  }, [NAME])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    )
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Pokemon no encontrado</div>
      </div>
    )
  }

  // Obtener la imagen con fallback
  const getPokemonImage = () => {
    if (pokemon.sprites?.other?.['official-artwork']?.front_default) {
      return pokemon.sprites.other['official-artwork'].front_default;
    }
    if (pokemon.sprites?.front_default) {
      return pokemon.sprites.front_default;
    }
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; // Imagen por defecto
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src={getPokemonImage()} 
              alt={pokemon.name}
              className="w-48 h-48 object-contain"
            />
            <div className="text-white">
              <h1 className="text-4xl font-bold capitalize mb-2">{pokemon.name}</h1>
              <div className="flex gap-2 mb-4">
                {pokemon.types?.map((type) => (
                  <span
                    key={type.type.name}
                    className="px-3 py-1 bg-white/20 rounded-full text-sm capitalize"
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/80">Altura</p>
                  <p className="text-xl">{pokemon.height / 10} m</p>
                </div>
                <div>
                  <p className="text-white/80">Peso</p>
                  <p className="text-xl">{pokemon.weight / 10} kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Estadísticas base</h2>
            <div className="space-y-3">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="flex items-center">
                  <span className="w-32 text-gray-600 capitalize">{stat.stat.name}</span>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                        style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="w-12 text-right text-gray-800 font-medium">{stat.base_stat}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Habilidades</h2>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <span
                  key={ability.ability.name}
                  className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 capitalize"
                >
                  {ability.ability.name.replace('-', ' ')}
                  {ability.is_hidden && 
                    <span className="ml-1 text-sm text-gray-500">(oculta)</span>
                  }
                </span>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Movimientos</h2>
            <div className="flex flex-wrap gap-2">
              {pokemon.moves
                .slice(0, showAllMoves ? pokemon.moves.length : 15)
                .map((move) => (
                  <span
                    key={move.move.name}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 capitalize"
                  >
                    {move.move.name.replace('-', ' ')}
                  </span>
                ))}
            </div>
            {pokemon.moves.length > 15 && (
              <button
                onClick={() => setShowAllMoves(!showAllMoves)}
                className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors duration-300"
              >
                {showAllMoves 
                  ? 'Mostrar menos movimientos' 
                  : `Ver todos los movimientos (${pokemon.moves.length})`
                }
              </button>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Sprites</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pokemon.sprites.front_default && (
                <img 
                  src={pokemon.sprites.front_default} 
                  alt="Front default"
                  className="w-24 h-24 object-contain mx-auto"
                />
              )}
              {pokemon.sprites.back_default && (
                <img 
                  src={pokemon.sprites.back_default} 
                  alt="Back default"
                  className="w-24 h-24 object-contain mx-auto"
                />
              )}
              {pokemon.sprites.front_shiny && (
                <img 
                  src={pokemon.sprites.front_shiny} 
                  alt="Front shiny"
                  className="w-24 h-24 object-contain mx-auto"
                />
              )}
              {pokemon.sprites.back_shiny && (
                <img 
                  src={pokemon.sprites.back_shiny} 
                  alt="Back shiny"
                  className="w-24 h-24 object-contain mx-auto"
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PokemonDetail