const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../modelos/usuario')
const app = express()

app.post('/login', (req, res) => {
    //Variable en la que vamos a recibir las cosas del body
    let body = req.body
    //Le pedimos que encuentre un solo usuario con ciertas caracteristicas
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        //Veo si el usuario existe
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectas'
                }
            })
        }

        //Veo si la contraseña es correcta
        //Con el comapreSync comparo si la password que se esta ingresando es la misma que esta guardada en el server
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectas'
                }
            })
        }

        //Con esto declaro el token con su respectiva firma
        let token = jwt.sing({ usuario: usuarioDB }, 'esta_es_la_firma', { expiresIn: '48h' })

        //Si todo esta OK
        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token,
        })
    })
})

module.exports = app;