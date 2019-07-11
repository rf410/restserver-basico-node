require('./config/config');
const express = require('express');
const mongoose = require('mongoose')
const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuración global de rutas
app.use(require('./routes/index'));

// Conexion a la db
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }, (err , res)=>{
    if (err) throw err;
    console.log('Base de datos online');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});