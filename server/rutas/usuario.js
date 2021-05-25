const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const Usuario = require('../modelos/usuario')
const { verificaToken } = require('../middlewares/autenticacion')
const app = express()

app.use(express.urlencoded({
    extended: true
}));

app.get('/usuarios', verificaToken, function (req, res) {
    let desde = req.query.desde || 0
    //Convierto lo que se guarde en desde a un número
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    // Dentro de las llaves, puedo poner parametros especiales que quiero que busque
    Usuario.find({ estado: true })
        // Sirve para buscar desde el registro numero x, que me muestre los que siguen
        .skip(desde)
        //Cuando ejecute la ruta Get solo va a mostrar x cantidad usuarios
        .limit(limite)
        //Sirve para ejecutar la busqueda
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cantidad: conteo
                })
            })

        })
})

app.post('/usuarios', function (req, res) {
    // res.json('POST usuarios')
    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            })
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB,
            })
        }
    })
})

app.put('/usuarios/:id', function (req, res) {
    //Datos que puedo actualizar en esta ruta
    let body = _.pick(body, ['nombre', 'img', 'role', 'estado'])
    let id = req.params.id

    //Este metodo recibe el id, una propiedad que puede o no estar, un callback
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
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
    })
})

app.delete('/usuarios/:id', function (req, res) {
    // res.json('DELETE usuarios')
    let id = req.params.id
    let estadoActualizado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, estadoActualizado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: {
                    message: 'Usuario no encontrado'
                },
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })
})

module.exports = app;