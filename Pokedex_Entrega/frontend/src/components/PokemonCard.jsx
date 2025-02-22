import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { usePokemon } from '../context/PokemonContext'

const PokemonCard = ({ pokemon }) => {
  const { isFavorite, addFavorite, removeFavorite } = usePokemon()
  const favorite = isFavorite(pokemon.id)

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(pokemon.id)
    } else {
      addFavorite(pokemon)
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <img 
        src={pokemon.sprites.front_default} 
        alt={pokemon.name}
        className="w-40 h-40 mx-auto"
      />
      <h2 className="text-2xl font-semibold capitalize mb-3 text-center text-indigo-900">{pokemon.name}</h2>
      <div className="flex gap-2 justify-center mb-4">
        {pokemon.types.map((type) => (
          <span
            key={type.type.name}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-md text-sm font-medium text-purple-900"
          >
            {type.type.name}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <button 
          onClick={handleFavorite}
          className={`px-4 py-2 rounded-md text-base font-medium ${
            favorite 
              ? 'bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 hover:to-amber-400 text-amber-900' 
              : 'bg-gradient-to-r from-gray-200 to-gray-100 hover:from-gray-300 hover:to-gray-200 text-gray-700'
          } transition-all duration-300`}
        >
          {favorite ? '★ Favorito' : '☆ Añadir a favoritos'}
        </button>
        <Link 
          to={`/pokemon/${pokemon.name.toLowerCase()}`}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md transition-all duration-300 text-base font-medium text-center"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  )
}

export default PokemonCard 