import { createContext, useContext, useState, useEffect } from 'react'

const PokemonContext = createContext()

export const PokemonProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentGeneration, setCurrentGeneration] = useState(1)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/favorites`)
        if (response.ok) {
          const data = await response.json()
          setFavorites(data)
        }
      } catch (error) {
        console.error('Error fetching favorites:', error)
      }
    }
    fetchFavorites()
  }, [])

  const getAllPokemons = async (start, end) => {
    try {
      setLoading(true)
      const url = `${import.meta.env.VITE_API_URL}/pokemons?start=${start}&end=${end}`;
      console.log('Intentando obtener pokémons:', { url, start, end });
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Pokémons recibidos:', data.length);
      setPokemons(data);
    } catch (error) {
      console.error('Error al obtener pokémons:', error);
      setPokemons([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadPokemonsByGeneration = () => {
      const ranges = {
        1: [1, 151],
        2: [152, 251],
        3: [252, 386],
        4: [387, 493],
        5: [494, 649]
      };
      const [start, end] = ranges[currentGeneration];
      console.log('Cargando generación:', { generation: currentGeneration, start, end });
      getAllPokemons(start, end);
    };

    loadPokemonsByGeneration();
  }, [currentGeneration]);

  const addFavorite = async (pokemon) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pokemon }),
      })
      
      if (response.ok) {
        const newFavorite = await response.json()
        setFavorites(prev => [...prev, newFavorite])
      }
    } catch (error) {
      console.error('Error adding favorite:', error)
    }
  }

  const removeFavorite = async (pokemonId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/favorites/${pokemonId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.pokemonId !== pokemonId))
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const isFavorite = (pokemonId) => {
    return favorites.some(favorite => favorite.pokemonId === pokemonId)
  }

  return (
    <PokemonContext.Provider value={{
      favorites,
      pokemons,
      loading,
      currentGeneration,
      setCurrentGeneration,
      getAllPokemons,
      addFavorite,
      removeFavorite,
      isFavorite
    }}>
      {children}
    </PokemonContext.Provider>
  )
}

export const usePokemon = () => {
  const context = useContext(PokemonContext)
  if (!context) {
    throw new Error('usePokemon debe ser usado dentro de un PokemonProvider')
  }
  return context
} 