// app.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

// Agregar middleware para parsear JSON
app.use(express.json());

// Obtener la ruta absoluta de la carpeta actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta de la carpeta "uploads"
const uploadsDir = path.join(__dirname, "uploads");

// Verificar si la carpeta "uploads" existe, si no, crearla
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Carpeta "${uploadsDir}" creada exitosamente.`);
} else {
  console.log(`Carpeta "${uploadsDir}" ya existe.`);
}

// Ruta de la carpeta "recycle" para almacenar archivos eliminados
const recycleDir = path.join(__dirname, "recycle");
if (!fs.existsSync(recycleDir)) {
  fs.mkdirSync(recycleDir, { recursive: true });
  console.log(`Carpeta "${recycleDir}" creada exitosamente.`);
} else {
  console.log(`Carpeta "${recycleDir}" ya existe.`);
}

// Servir archivos estáticos (como el HTML)
app.use(express.static(path.join(__dirname, "public")));

// Usar las rutas para manejar uploads/files
app.use("/uploads", uploadRoutes);

// Configuramos el puerto donde va a escuchar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
