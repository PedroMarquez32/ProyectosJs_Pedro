const About = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-red-500 to-red-700">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full m-4 transform hover:scale-105 transition-transform duration-300">
        {/* Card Header */}
        <div className="relative mb-16">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg">
            <img 
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/6.png" 
              alt="Charizard Shiny"
              className="w-24 h-24 animate-bounce-slow"
            />  
          </div>
        </div>

        {/* Card Content */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Pedro Javier Marquez Lizana</h2>
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">Desarrollador Web</span>
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">Pokémon Trainer</span>
          </div>

          {/* Descripción */}
          <p className="text-gray-600 text-center mb-6">
            Apasionado por el desarrollo web y el mundo Pokémon. 
            Siempre en busca de nuevos desafíos y aprendizajes.
          </p>

          {/* Stats - Similar a stats de Pokémon */}
          <div className="w-full space-y-2 mb-6">
            <div className="flex items-center">
              <span className="w-24 text-sm text-gray-600">HTML/CSS</span>
              <div className="flex-1 h-4 bg-gray-200 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{width: '90%'}}></div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm text-gray-600">JavaScript</span>
              <div className="flex-1 h-4 bg-gray-200 rounded-full">
                <div className="h-full bg-yellow-500 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm text-gray-600">React</span>
              <div className="flex-1 h-4 bg-gray-200 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{width: '80%'}}></div>
              </div>
            </div>
          </div>
          
          {/* Redes Sociales */}
          <div className="flex space-x-6">
            <a 
              href="https://github.com/PedroMarquez32" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-red-500 transform hover:scale-110 transition-transform duration-300"
            >
              <i className="fab fa-github text-3xl"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
