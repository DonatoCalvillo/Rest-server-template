const validaCampos = require('../middlewares/validar-campos.js')
const  validaJWT  = require('../middlewares/validar-jwt.js')
const  validaRoles  = require('../middlewares/valida-roles.js')

module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles
}