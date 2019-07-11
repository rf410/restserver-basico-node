// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del token
process.env.CADUCIDAD_TOKEN = '7d';

// SEED de autenticacion
process.env.SEED = process.env.SEED || 'seed-desarrollo-super-secreto-shh';

// DB
let urlDB
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // MONGO_DB es una variable de enterno personalizada en heroku
    urlDB = process.env.MONGO_DB;
}

process.env.URLDB = urlDB;