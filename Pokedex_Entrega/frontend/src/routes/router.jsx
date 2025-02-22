import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import { ROUTES } from './paths'
import ErrorPage from '../pages/ErrorPage'
import Home from '../pages/Home'
import SearchPage from '../pages/SearchPage'
import Favorites from '../pages/Favorites'
import About from '../pages/About'
import PokemonDetail from '../pages/PokemonDetail'



export const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            { path: ROUTES.HOME, element: <Home /> },
            
            { path: ROUTES.SEARCH, element: <SearchPage /> },
            
            { path: ROUTES.FAVORITES, element: <Favorites /> },
            
            { path: ROUTES.ABOUT, element: <About /> },
            
            { path: ROUTES.POKEMON_DETAIL, element: <PokemonDetail />,
                errorElement: <ErrorPage />,
                
             },
        ],
    },
])