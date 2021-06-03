const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
    const { correo, contrasenia } = req.body;

    try {
        //Verificar si email existe
        const usuario = await Usuario.findOne({ correo });

        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario/Password no son correoctos - correo'
            });
        }

        //Verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario/Password no son correoctos - estado: false'
            });
        }

        //Verificar contrasenia
        const validPassword = bcryptjs.compareSync(contrasenia, usuario.contrasenia);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario/Password no son correoctos - password'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
 
}

module.exports = {
    login
}