const {Router} = require('express')
const { check } = require('express-validator');

const { crearProducto, 
    obtenerProductos, 
    obtenerProducto,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');

const { productoPorIdExiste } = require('../helpers/db-validator');

const { validarJWT, validarCampos, esAdmin } = require('../middlewares');

const router = Router();

//Obtener todas los productos - publicoss
router.get('/', obtenerProductos );

//Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(productoPorIdExiste),
    validarCampos
], obtenerProducto );

//Crear producto - privado - cualquier usuario con token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    validarCampos
], crearProducto);

//Actulizar una categoria - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(productoPorIdExiste),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    validarCampos
] , actualizarProducto );

//Borrar producto - privado - admin
router.delete('/:id',[
    validarJWT,
    esAdmin,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(productoPorIdExiste),
    validarCampos
 ] , borrarProducto );

module.exports = router