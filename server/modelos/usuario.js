const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un rol valido'
}

let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
})

//Verifica que el email sea valido
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser unico'
})

//Retorno todos los datos menos password por obvias razones
usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject()
    delete userObject.password
    return userObject
}

//Exporta no se que cosa 
module.exports = mongoose.model('Usuario', usuarioSchema)