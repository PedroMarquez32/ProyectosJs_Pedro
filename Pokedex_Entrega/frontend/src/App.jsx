import React from 'react'
import { Toaster } from 'sonner'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import { PokemonProvider } from './context/PokemonContext'


const App = () => {
  return (
    <PokemonProvider>
      <Toaster position='top-right' duration={2000} closeButton={true} />
      <RouterProvider router={router} />
    </PokemonProvider>
  )
}

export default App