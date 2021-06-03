const { request, response } = require("express")


const esAdmin = (req = request, res= response, next) =>{

    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    const {rol, nombre} = req.usuario;

    if(rol !== 'ADMIN'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esta accion`
        })
    }

    next();
}

const tieneRol = (...roles) => {
    return (req = request, res= response, next) =>{
        const {rol} = req.usuario;

        if(!roles.includes( rol )){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })
        }
        
        next();
    }
}

module.exports = {
    esAdmin,
    tieneRol
}