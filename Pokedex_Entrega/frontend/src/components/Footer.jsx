const Footer = () => {
  return (
    <footer className="sticky bottom-0 w-full z-50 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 text-white py-3 shadow-lg border-t border-purple-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">Pokédex App</h3>
            <span className="text-sm text-purple-200">Explora el mundo Pokémon</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-purple-200">&copy; {new Date().getFullYear()} Pedro Marquez</span>
            <a 
              href="https://github.com/PedroMarquez32" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-200 hover:text-white transition-colors"
            >
              <i className="fab fa-github text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 