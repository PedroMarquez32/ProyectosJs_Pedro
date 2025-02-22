const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/pokemon_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Conexión exitosa a MongoDB');
    
    // Crear la colección si no existe
    if (!mongoose.connection.collections['pokemons']) {
        await mongoose.connection.createCollection('pokemons');
        console.log('Colección pokemons creada');
    }
})
.catch(error => {
    console.error('Error de conexión:', error);
}); 