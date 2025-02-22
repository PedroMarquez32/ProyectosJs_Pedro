import fetch from 'node-fetch';
import { Pokemon, Favorite } from '../models/pokemon.model.js';

export const transformPokemonData = (pokemonData) => {
  return {
    id: pokemonData.id,
    name: pokemonData.name,
    types: pokemonData.types.map(type => ({
      type: {
        name: type.type.name,
        url: type.type.url
      }
    })),
    sprites: {
      front_default: pokemonData.sprites.front_default || '',
      back_default: pokemonData.sprites.back_default || '',
      front_shiny: pokemonData.sprites.front_shiny || '',
      back_shiny: pokemonData.sprites.back_shiny || '',
      other: {
        'official-artwork': {
          front_default: pokemonData.sprites.other?.['official-artwork']?.front_default || '',
          front_shiny: pokemonData.sprites.other?.['official-artwork']?.front_shiny || ''
        }
      }
    },
    stats: pokemonData.stats.map(stat => ({
      base_stat: Number(stat.base_stat),
      stat: {
        name: stat.stat.name
      }
    })),
    height: Number(pokemonData.height),
    weight: Number(pokemonData.weight),
    abilities: pokemonData.abilities.map(ability => ({
      ability: {
        name: ability.ability.name,
        url: ability.ability.url
      },
      is_hidden: ability.is_hidden
    })),
    moves: pokemonData.moves.map(move => ({
      move: {
        name: move.move.name,
        url: move.move.url
      }
    }))
  };
};

export const getAllPokemons = async (req, res) => {
  try {
    const { start = 1, end = 151 } = req.query;
    const startNum = parseInt(start);
    const endNum = parseInt(end);
    
    console.log('Petición recibida para pokemons:', { start: startNum, end: endNum });
    
    // Primero, eliminar los Pokémon existentes en ese rango
    await Pokemon.deleteMany({
      id: { $gte: startNum, $lte: endNum }
    });

    // Obtener todos los Pokémon nuevamente
    const fetchPromises = [];
    for (let i = startNum; i <= endNum; i++) {
      fetchPromises.push(
        fetch(`${process.env.POKEAPI_URL}/pokemon/${i}`)
          .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
          })
          .then(async (pokemonData) => {
            const transformedPokemon = transformPokemonData(pokemonData);
            const pokemon = new Pokemon(transformedPokemon);
            return pokemon.save();
          })
          .catch(error => {
            console.error(`Error procesando pokemon ${i}:`, error);
            return null;
          })
      );
    }

    const pokemons = (await Promise.all(fetchPromises))
      .filter(Boolean)
      .sort((a, b) => a.id - b.id);

    res.json(pokemons);
  } catch (error) {
    console.error('Error en getAllPokemons:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getPokemonByName = async (req, res) => {
  try {
    const { name } = req.params;
    let pokemon = await Pokemon.findOne({ name: name.toLowerCase() });

    if (!pokemon) {
      const response = await fetch(`${process.env.POKEAPI_URL}/pokemon/${name.toLowerCase()}`);
      if (!response.ok) {
        return res.status(404).json({ message: 'Pokemon not found' });
      }
      const pokemonData = await response.json();
      const transformedPokemon = transformPokemonData(pokemonData);
      
      pokemon = new Pokemon(transformedPokemon);
      await pokemon.save();
    }

    res.json(pokemon);
  } catch (error) {
    console.error('Error en getPokemonByName:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find().populate('pokemon');
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { pokemon } = req.body;
    const favorite = new Favorite({
      pokemonId: pokemon.id,
      pokemon: pokemon
    });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    await Favorite.findOneAndDelete({ pokemonId: id });
    res.status(200).json({ message: 'Favorite removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchPokemons = async (req, res) => {
  try {
    const { term } = req.params;
    const pokemons = await Pokemon.find({
      name: { $regex: term.toLowerCase(), $options: 'i' }
    });
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
