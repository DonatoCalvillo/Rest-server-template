const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario')

const validarJWT = async(req = request, res = response, next) =>{
    const token = req.header('x-token');

    //Ver si mando un token
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    //Verificar que sea uno de nuestros tokens
    try {

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        //Verificar que exista el usuario
        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existente'
            })
        }
         
        //Verificar si el UID tiene estado en TRUE
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - usuario deshabilitado'
            })
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        // console.log(error);
        res.status(401).json({
            msg: 'Token no valido - excepcion al ver el token'
        })
        
    }

}

module.exports = {
    validarJWT
}