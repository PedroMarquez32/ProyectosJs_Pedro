// controllers/uploadController.js
import fs from "fs";
import multer from "multer";
import path from "path";

// Configuración de Multer: almacenamiento y nombres de archivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Carpeta donde se guardarán los archivos subidos
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    // Guardamos el archivo con un nombre único basado en la fecha y el nombre original
    // cb(null, `${Date.now()}-${file.originalname}`);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Función auxiliar para obtener el tamaño del directorio
const getDirSize = (dirPath) => {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    size += stats.size;
  });
  return size;
};

// Todas las funciones del controlador
const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No se ha subido ningún archivo");
    }
    res.send(`Archivo subido con éxito: ${req.file.filename}`);
  } catch (error) {
    res.status(500).send("Error al subir archivo");
  }
};

const listFiles = (req, res) => {
  const uploadDir = path.join(process.cwd(), "uploads");
  try {
    const files = fs.readdirSync(uploadDir).map(file => {
      const stats = fs.statSync(path.join(uploadDir, file));
      return {
        name: file,
        size: stats.size,
        uploadDate: stats.mtime.toISOString(),
      };
    });
    res.json(files);
  } catch (err) {
    res.status(500).send("Error al listar archivos");
  }
};

const deleteFile = (req, res) => {
  const fileName = req.params.fileName;
  const sourcePath = path.join(process.cwd(), "uploads", fileName);
  const destPath = path.join(process.cwd(), "recycle", fileName);

  try {
    // Verificar si el archivo existe
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).send(`Archivo no encontrado: ${fileName}`);
    }

    // Si el archivo ya existe en la papelera, eliminarlo primero
    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath);
    }

    // Mover el archivo
    fs.copyFileSync(sourcePath, destPath);
    fs.unlinkSync(sourcePath);

    console.log('Archivo movido exitosamente:', {
      from: sourcePath,
      to: destPath
    });

    res.status(200).send(`Archivo ${fileName} movido a papelera`);
  } catch (err) {
    console.error('Error detallado:', err);
    res.status(500).send(`Error al mover archivo a papelera: ${err.message}`);
  }
};

const listRecycledFiles = (req, res) => {
  const recycleDir = path.join(process.cwd(), "recycle");
  fs.readdir(recycleDir, (err, files) => {
    if (err) {
      return res.status(500).send("Error al listar archivos reciclados");
    }
    res.json(files);
  });
};

const restoreFile = (req, res) => {
  const fileName = req.params.fileName;
  const sourcePath = path.join(process.cwd(), "recycle", fileName);
  const destPath = path.join(process.cwd(), "uploads", fileName);

  try {
    // Verificar si el archivo existe en la papelera
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).send(`Archivo no encontrado en papelera: ${fileName}`);
    }

    // Si el archivo ya existe en uploads, eliminarlo primero
    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath);
    }

    // Mover el archivo usando copy y unlink en lugar de rename
    fs.copyFileSync(sourcePath, destPath);
    fs.unlinkSync(sourcePath);

    console.log('Archivo restaurado exitosamente:', {
      from: sourcePath,
      to: destPath
    });

    res.status(200).send(`Archivo ${fileName} restaurado`);
  } catch (err) {
    console.error('Error detallado al restaurar:', err);
    res.status(500).send(`Error al restaurar archivo: ${err.message}`);
  }
};

const emptyRecycleBin = (req, res) => {
  const recycleDir = path.join(process.cwd(), "recycle");
  
  try {
    const files = fs.readdirSync(recycleDir);
    
    if (files.length === 0) {
      return res.status(200).send("La papelera ya está vacía");
    }

    for (const file of files) {
      const filePath = path.join(recycleDir, file);
      fs.unlinkSync(filePath);
    }

    res.status(200).send(`Se eliminaron ${files.length} archivos de la papelera`);
  } catch (error) {
    console.error("Error al vaciar la papelera:", error);
    res.status(500).send("Error al vaciar la papelera");
  }
};

const getSpaceUsage = (req, res) => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  const recycleDir = path.join(process.cwd(), "recycle");

  const usage = {
    uploads: getDirSize(uploadsDir),
    recycle: getDirSize(recycleDir)
  };

  res.json(usage);
};

const deleteFromRecycle = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(process.cwd(), "recycle", fileName);
  
  console.log('Intentando eliminar archivo:', {
    fileName,
    filePath,
    exists: fs.existsSync(filePath)
  });

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Archivo eliminado con éxito:', filePath);
      res.status(200).send('Archivo eliminado permanentemente');
    } else {
      console.log('Archivo no encontrado:', filePath);
      res.status(404).send('Archivo no encontrado');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).send('Error al eliminar el archivo');
  }
};

// Una única exportación al final
export {
  upload,
  uploadFile,
  listFiles,
  deleteFile,
  listRecycledFiles,
  restoreFile,
  emptyRecycleBin,
  getSpaceUsage,
  deleteFromRecycle
};
