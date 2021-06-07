const { response, request } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const usuario = require("../models/usuario");

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

const googleSignIn = async(req = request, res = response) =>{
    const {id_token} = req.body;

    try {
        const {correo, nombre, img} = await googleVerify(id_token);

        //Agregar el usuario a la db
        //Checar si el correo ya existe
        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //Tengo que crearlo 
            const data = {
                nombre,
                correo,
                contrasenia: ':p',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }
        
        //Si el usuario en DB 
        if(!usuario.estado){
            return res.json(401).json({
                msg:'Hable con el admin, usuario bloqueado'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            msg : 'Token de google no es reconocido o valido'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}