const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {

    const body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        // Manejo de errores en la busqueda del usuario
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // Manejo de error si no viene el usuario
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) y/o contraseña incorrectos.'
                }
            });
        };

        // Manejo de error si no viene el password
        if (!body.password) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'contraseña requerida'
                }
            });

        }

        // Validación de la contraseña
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y/o (contraseña) incorrectos.'
                }
            });
        };

        const token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        // Respuesta si todo sale bien
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});

module.exports = app;