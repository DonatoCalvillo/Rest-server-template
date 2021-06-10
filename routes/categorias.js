const {Router} = require('express')
const { check } = require('express-validator');

const { obtenerCategorias, 
   crearCategoria, 
   obtenerCategoria,
   borrarCategoria,
   actualizarCategoria
} = require('../controllers/categorias');

const { validarJWT,
   validarCampos,
   validarId,
   esAdmin
} = require('../middlewares');

const router = Router()

//Obtener todas las categorias - publicoss
router.get('/', obtenerCategorias );

//Obtener una categoria por id - publico
router.get('/:id', [
   check('id', 'No es un id de Mongo valido').isMongoId(),
   check('id').custom(validarId),
   validarCampos
], obtenerCategoria );

//Crear categoria - privado - cualquier usuario con token valido
router.post('/',[
   validarJWT,
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   validarCampos
], crearCategoria);

//Actulizar una categoria - privado - cualquiera con token valido
router.put('/:id',[
   validarJWT,
   check('id', 'No es un id de Mongo valido').isMongoId(),
   check('id').custom(validarId),
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   validarCampos
] , actualizarCategoria );

//Borrar categoria - privado - admin
router.delete('/:id',[
   validarJWT,
   esAdmin,
   check('id', 'No es un id de Mongo valido').isMongoId(),
   check('id').custom(validarId),
   validarCampos
] , borrarCategoria );

module.exports = router