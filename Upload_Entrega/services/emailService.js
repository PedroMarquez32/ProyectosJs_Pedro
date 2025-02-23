import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Configurar SendGrid con la API key
const apiKey = process.env.SENDGRID_API_KEY;
console.log('API Key length:', apiKey?.length);

if (!apiKey) {
  throw new Error('SENDGRID_API_KEY no está configurada');
}

// Limpiar la API key
const cleanApiKey = apiKey.trim();
sgMail.setApiKey(cleanApiKey);

// Función para calcular el tamaño de una carpeta y obtener detalles de archivos
const getFolderDetails = (directoryPath) => {
  let totalSize = 0;
  const files = [];
  
  fs.readdirSync(directoryPath).forEach(file => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);
    const sizeInKB = (stats.size / 1024).toFixed(2);
    totalSize += stats.size;
    
    files.push({
      name: file,
      size: sizeInKB,
      date: stats.mtime
    });
  });

  return {
    totalSize: (totalSize / 1024).toFixed(2),
    files
  };
};

export const subscribeEmail = async (email) => {
  try {
    if (!email || !email.includes('@')) {
      throw new Error('Email inválido');
    }

    // Obtener datos reales de las carpetas
    const uploadsDir = path.join(process.cwd(), "uploads");
    const recycleDir = path.join(process.cwd(), "recycle");
    
    const uploadsDetails = getFolderDetails(uploadsDir);
    const recycleDetails = getFolderDetails(recycleDir);
    
    const totalSize = (
      parseFloat(uploadsDetails.totalSize) + 
      parseFloat(recycleDetails.totalSize)
    ).toFixed(2);

    const msg = {
      to: email,
      from: 'pedrojaviermarquelizana@gmail.com',
      subject: 'Reporte de Almacenamiento',
      text: 'Reporte de almacenamiento de archivos',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #1a73e8;">Reporte de Almacenamiento</h2>
          <p>Espacio Total Usado: ${totalSize} KB</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px;">
            <h3 style="color: #1a73e8; margin-top: 0;">📁 Carpeta de Uploads (${uploadsDetails.totalSize} KB)</h3>
            <div style="margin-left: 20px;">
              ${uploadsDetails.files.map(file => `
                <p>📄 ${file.name}</p>
                <p style="color: #666; font-size: 14px;">Tamaño: ${file.size} KB | Subido: ${new Date(file.date).toLocaleString()}</p>
              `).join('')}
            </div>
          </div>

          <div style="background-color: #fff3f3; padding: 15px; margin: 10px 0; border-radius: 5px;">
            <h3 style="color: #dc3545; margin-top: 0;">🗑️ Papelera de Reciclaje (${recycleDetails.totalSize} KB)</h3>
            <div style="margin-left: 20px;">
              ${recycleDetails.files.map(file => `
                <p>🗑️ ${file.name}</p>
                <p style="color: #666; font-size: 14px;">Tamaño: ${file.size} KB | Eliminado: ${new Date(file.date).toLocaleString()}</p>
              `).join('')}
            </div>
          </div>
        </div>
      `
    };

    console.log('Intentando enviar email con configuración:', {
      to: email,
      from: msg.from,
      apiKeyLength: cleanApiKey.length
    });

    const response = await sgMail.send(msg);
    console.log('Email enviado correctamente:', response);
    return true;
  } catch (error) {
    console.error('Error completo:', error);
    
    if (error.response && error.response.body) {
      const errorDetails = error.response.body;
      console.error('Error de SendGrid detallado:', errorDetails);
      
      if (errorDetails.errors && errorDetails.errors[0]) {
        throw new Error(errorDetails.errors[0].message);
      }
    }
    
    throw new Error(`Error al enviar email: ${error.message}`);
  }
}; 