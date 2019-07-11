const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificarToken, verificaAdminRole } = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', verificarToken , (req, res) => {
    // Recupero parametros desde el url para limitar la consulta
    // Si no los trae usa los especificados abajo por defecto
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    let estado = req.query.estado || true;

    // Los campos en la cadena de abajo son los que devuelve la consulta
    Usuario.find({estado: estado}, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Usuario.countDocuments({ estado: estado }, (err, contador) => {
                res.json({
                    ok: true,
                    usuarios,
                    registrosTotales: contador
                });

            });


        });
});

app.post('/usuario', [verificarToken, verificaAdminRole], (req, res) => {
    // Recupera los datos desde la peticion
    const body = req.body;

    // Encriptar contraseña
    let pass = bcrypt.hashSync(body.password, 12);

    // Se asignan los datos en el modelo del Usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: pass,
        role: body.role
    });

    // Se guardan los datos en mongoDB o se lanza error 
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

app.put('/usuario/:id', [verificarToken, verificaAdminRole], (req, res) => {
    const { id } = req.params;
    const body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    // new: true devuelve el objeto actualizado
    // runValidators: true se asegura que corran las validaciones del schema
    Usuario.findOneAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

// // Borra el registro completamente de la bd.
// app.delete('/usuario/:id', (req, res) => {
//     const { id } = req.params;

//     /* Para utilizar el metodo findOneAndRemove es necesario pasar
//        el criterio de busqueda según esta guardado en la bd.
//        En este caso, al querer borrar por id se hace como esta abajo
//     */
//     Usuario.findOneAndRemove({_id: id}, (err, usuarioBorrado) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         };

//         if (!usuarioBorrado) {
//             return res.status(400).json({
//                 ok: false,
//                 err: "El usuario no existe"
//             });
//         };

//         res.json({
//             ok: true,
//             message: 'Se ha eliminado correctamente el usuario',
//             usuarioBorrado
//         });
//     });
// });

app.delete('/usuario/:id', [verificarToken, verificaAdminRole], (req, res) => {
    const { id } = req.params;

    const estado = {
        estado: false
    }

    Usuario.findOneAndUpdate({ _id: id }, estado, { new: true },( err, usuarioDB ) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            message: 'Usuario actualizado!',
            usuarioDB
        })
    });
});

module.exports = app;