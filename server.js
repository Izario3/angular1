const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configurar `multer` para guardar imágenes en `public/assets`
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "public", "assets")); // Guarda en `public/assets`
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Usa el nombre original
    }
  });
  const upload = multer({ storage });


app.post("/guardar-xml", (req, res) => {
  const xmlData = req.body.xml;
  const filePath = path.resolve("public/assets/productos.xml");
  fs.writeFile(filePath, xmlData, (err) => {
    if (err) {
      console.error("Error al guardar XML:", err);
      return res.status(500).send("Error al guardar el archivo");
    }
    res.send("Archivo guardado en: " + filePath);
  });
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));