const {Router, response} = require('express')
const { check } = require('express-validator');
const { cargarArchivo, 
    mostrarImagen,
    actualizarImgCloudinary
} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', validarArchivoSubir ,cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongos').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos']) ),
    validarCampos
], actualizarImgCloudinary)

router.get('/:coleccion/:id',[
    check('id', 'El id debe ser de mongos').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos']) ),
    validarCampos
], mostrarImagen)

module.exports = router;