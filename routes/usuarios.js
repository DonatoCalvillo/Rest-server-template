const {Router} = require('express')
const { check } = require('express-validator')

//IMPORTACIONES PROPIAS
const { validarCampos,
    validarJWT,
    esAdmin
} = require('../middlewares')

const { usuariosGet, 
    usuariosPost, 
    usuariosPut,
    usuariosDelete 
} = require('../controllers/usuarios')

const { esRolValido, 
    emailExiste,
    usuarioPorIdExiste 
} = require('../helpers/db-validator.js')

const router = Router()

//MIDLEWARES----------------------------------
//Si se necesita enviar middlewares se hace
//en la pos 1 de los parametros, en este caso
//se envia un arreglo de middlewares
//EN CASO DE ERROR, SE VAN ACUMULANDO EN EL REQ
//---------------------------------------------

router.get('/',  usuariosGet)

router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(usuarioPorIdExiste),
    check('rol').custom(  esRolValido ),
    validarCampos
] , usuariosPut )

router.post('/', [
    check('correo', 'El correo no es valido').isEmail(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('contrasenia', 'La contrasenia debe ser de mas de 6 letras').isLength({min:6}),
    check('rol').custom(  esRolValido ),
    check('correo').custom(  emailExiste ),
    validarCampos
], usuariosPost)

router.delete('/:id', [
    validarJWT,
    esAdmin,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(usuarioPorIdExiste),
    validarCampos
] ,usuariosDelete)

module.exports = router