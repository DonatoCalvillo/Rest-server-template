const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario')

const usuariosGet = async(req = request, res = response) => {

    const {limite = 5, desde = 0} = req.query;

    const query = { estado: true};

    /*Promise.all ejecuta las promesas al mismo tiempo
    porque una no depende de la otra, por lo que se 
    optimiza el tiempo*/

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({total, usuarios})
}

const usuariosPost = async (req, res = response) => {
    
    const {nombre, correo, contrasenia, rol} = req.body;
    const usuario = new Usuario({nombre, correo, contrasenia, rol});

    //Ecriptar contrasenia
    const salt = bcryptjs.genSaltSync();
    usuario.contrasenia = bcryptjs.hashSync(contrasenia, salt);

    //Guardar en db
    await usuario.save();

    res.json(usuario);

}

const usuariosPut = async (req = request, res = response) => {

    const {id} = req.params;
    const {_id, contrasenia, google, correo, ...resto} = req.body;

    //validar contra db
    if(contrasenia){
        //Ecriptar contrasenia
        const salt = bcryptjs.genSaltSync();
        resto.contrasenia = bcryptjs.hashSync(contrasenia, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}


const usuariosDelete = async(req, res = response) => {
    const {id} = req.params;

    //Borrar un dato fisicamente de la db----------------
    //const usuario = await Usuario.findByIdAndDelete(id);
    //---------------------------------------------------

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
    const usuarioLogueado = req.usuario;

    res.json({usuario,usuarioLogueado});
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}