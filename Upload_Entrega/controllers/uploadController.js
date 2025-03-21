import fs from "fs";
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });


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
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).send(`Archivo no encontrado: ${fileName}`);
    }

    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath);
    }

    
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
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).send(`Archivo no encontrado en papelera: ${fileName}`);
    }

    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath);
    }

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
  try {
    const uploadDir = path.join(process.cwd(), "uploads");
    const recycleDir = path.join(process.cwd(), "recycle");
    
    // Función para calcular el tamaño total de una carpeta
    const getFolderSize = (directoryPath) => {
      let totalSize = 0;
      const files = fs.readdirSync(directoryPath);
      
      files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      });
      
      return totalSize;
    };

    // Calcular tamaños
    const uploadsSize = getFolderSize(uploadDir);
    const recycleSize = getFolderSize(recycleDir);
    const totalSize = uploadsSize + recycleSize;

    // Convertir a MB para mejor legibilidad
    const toMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

    res.json({
      uploads: {
        size: uploadsSize,
        sizeInMB: toMB(uploadsSize),
        percentage: totalSize ? ((uploadsSize / totalSize) * 100).toFixed(2) : 0
      },
      recycle: {
        size: recycleSize,
        sizeInMB: toMB(recycleSize),
        percentage: totalSize ? ((recycleSize / totalSize) * 100).toFixed(2) : 0
      },
      total: {
        size: totalSize,
        sizeInMB: toMB(totalSize)
      }
    });
  } catch (error) {
    console.error('Error al obtener el uso de espacio:', error);
    res.status(500).json({ error: 'Error al calcular el espacio usado' });
  }
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
