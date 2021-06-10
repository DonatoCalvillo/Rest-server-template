const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;

const {Usuario,
    Categoria,
    Producto
} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino, res = response) =>{
    const esMongoId = ObjectId.isValid(termino); //true

    if( esMongoId ){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const usuarios = await Usuario.find({
        $or : [{nombre: regex,}, {correo: regex}],
        $and : [{estado:true}]
    });

    res.json({
        results: usuarios
    });
}

const buscarCategorias = async(termino, res = response) =>{
    const esMongoId = ObjectId.isValid(termino); //true

    if( esMongoId ){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({
        $or : [{nombre: regex,}],
        $and : [{estado:true}]
    })
    .populate('usuario', 'nombre');

    res.json({
        results: categorias
    });
}

const buscarProductos = async(termino, res = response) =>{
    const esMongoId = ObjectId.isValid(termino); //true

    if( esMongoId ){
        const producto = await Producto.findById(termino);
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const productos = await Producto.find({
        $or : [{nombre: regex}],
        $and : [{estado:true}]
    })
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

    res.json({
        results: productos
    });
}

const buscar = (req = request, res = response) =>{
    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Usted busca '${coleccion}' y las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch(coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categoria':
            buscarCategorias(termino,res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
    }
}

module.exports = {
    buscar
}