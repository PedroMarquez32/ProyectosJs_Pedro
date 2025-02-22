import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadsDir = path.join(__dirname, "uploads");


if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Carpeta "${uploadsDir}" creada exitosamente.`);
} else {
  console.log(`Carpeta "${uploadsDir}" ya existe.`);
}

const recycleDir = path.join(__dirname, "recycle");
if (!fs.existsSync(recycleDir)) {
  fs.mkdirSync(recycleDir, { recursive: true });
  console.log(`Carpeta "${recycleDir}" creada exitosamente.`);
} else {
  console.log(`Carpeta "${recycleDir}" ya existe.`);
}


app.use(express.static(path.join(__dirname, "public")));


app.use("/uploads", uploadRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
