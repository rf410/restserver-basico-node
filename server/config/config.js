// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// DB
let urlDB
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // MONGO_DB es una variable de enterno personalizada en heroku
    urlDB = process.env.MONGO_DB;
}

process.env.URLDB = urlDB;