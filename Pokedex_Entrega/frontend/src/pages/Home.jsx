import { useEffect } from 'react'
import PokemonCard from '../components/PokemonCard'
import { usePokemon } from '../context/PokemonContext'
import { GENERATIONS } from '../utils/generations'

const Home = () => {
    const { 
        pokemons, 
        loading, 
        getAllPokemons, 
        currentGeneration, 
        setCurrentGeneration 
    } = usePokemon()

    useEffect(() => {
        const generation = GENERATIONS[currentGeneration - 1]
        getAllPokemons(generation.start, generation.end)
    }, [currentGeneration])

    const handleGenerationChange = (genId) => {
        setCurrentGeneration(genId)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        )
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-4xl font-bold mb-6 text-center text-white'>Pokémon por Generación</h1>
            
            <div className='flex flex-wrap justify-center gap-2 mb-8'>
                {GENERATIONS.map((gen) => (
                    <button
                        key={gen.id}
                        onClick={() => handleGenerationChange(gen.id)}
                        className={`px-4 py-2 rounded-full transition-all duration-300 ${
                            currentGeneration === gen.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-purple-200 text-purple-900 hover:bg-purple-300'
                        }`}
                    >
                        {gen.name}
                    </button>
                ))}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto'>
                {pokemons.map((pokemon) => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
            </div>
        </div>
    )
}

export default Home