import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Crear índices si no existen
    if (mongoose.models.Pokemon) {
      const Pokemon = mongoose.model('Pokemon');
      try {
        // Primero verificamos si los índices existen
        const existingIndexes = await Pokemon.collection.listIndexes().toArray();
        const hasIdIndex = existingIndexes.some(index => index.name === 'id_1');
        const hasNameIndex = existingIndexes.some(index => index.name === 'name_1');

        // Si no existen, los creamos
        if (!hasIdIndex) {
          await Pokemon.collection.createIndex({ id: 1 }, { unique: true });
          console.log('Índice de ID creado');
        }
        if (!hasNameIndex) {
          await Pokemon.collection.createIndex({ name: 1 });
          console.log('Índice de nombre creado');
        }
        
        console.log('Índices verificados correctamente');
      } catch (indexError) {
        console.warn('Advertencia al manejar índices:', indexError);
        // Continuamos aunque haya error con los índices
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return false;
  }
};

// Manejadores de eventos de conexión
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});
