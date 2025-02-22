import { Router } from 'express';
import {
  getAllPokemons,
  getPokemonByName,
  getFavorites,
  addFavorite,
  removeFavorite,
  searchPokemons
} from '../controllers/pokemon.controller.js';

const router = Router();

router.get('/pokemons', getAllPokemons);
router.get('/pokemon/:name', getPokemonByName);
router.get('/pokemon/search/:term', searchPokemons);
router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:id', removeFavorite);

export default router;
