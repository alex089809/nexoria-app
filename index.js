const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors()); // permite llamadas desde el HTML

let codigos = {}; // almacenar c��digos temporalmente

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_PASS, 
  }
});

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000);
}

app.post('/enviar-codigo', (req, res) => {
  const { email } = req.body;
  const codigo = generarCodigo();
  codigos[email] = codigo;

  const mailOptions = {
    from: `"Nexoria Group" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'C��digo de verificaci��n Nexoria',
    text: `Tu c��digo de verificaci��n es: ${codigo}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if(error){
      console.log(error);
      return res.status(500).send('Error al enviar correo');
    }
    console.log(`Correo enviado a ${email}: ${codigo}`);
    res.send('C��digo enviado correctamente');
  });
});

app.post('/verificar-codigo', (req, res) => {
  const { email, codigoIngresado } = req.body;
  if(codigos[email] && parseInt(codigoIngresado) === codigos[email]){
    delete codigos[email];
    res.send('Cuenta verificada �7�3');
  } else {
    res.status(400).send('C��digo incorrecto �7�4');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});