import mongoose from 'mongoose';

const typeSchema = new mongoose.Schema({
  type: {
    name: { type: String, required: true },
    url: String
  }
}, { _id: false });

const statSchema = new mongoose.Schema({
  base_stat: Number,
  stat: {
    name: String
  }
}, { _id: false });

const abilitySchema = new mongoose.Schema({
  ability: {
    name: String
  },
  is_hidden: Boolean
}, { _id: false });

const moveSchema = new mongoose.Schema({
  move: {
    name: String
  }
}, { _id: false });

const pokemonSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  types: [typeSchema],
  sprites: {
    front_default: String,
    back_default: String,
    front_shiny: String,
    back_shiny: String,
    other: {
      'official-artwork': {
        front_default: String
      }
    }
  },
  stats: [statSchema],
  height: Number,
  weight: Number,
  abilities: [abilitySchema],
  moves: [moveSchema]
}, {
  timestamps: true
});

const favoriteSchema = new mongoose.Schema({
  userId: String,
  pokemonId: Number,
  pokemon: pokemonSchema
}, { timestamps: true });

export const Pokemon = mongoose.model('Pokemon', pokemonSchema);
export const Favorite = mongoose.model('Favorite', favoriteSchema);