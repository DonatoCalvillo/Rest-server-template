const validaCampos = require('../middlewares/validar-campos.js')
const  validaJWT  = require('../middlewares/validar-jwt.js')
const  validaRoles  = require('../middlewares/valida-roles.js')
const  validaCategorias  = require('../middlewares/validar-categorias')

module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
    ...validaCategorias
}