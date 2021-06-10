const { request, response } = require("express");
const { model, models } = require("mongoose");
const { Producto, Categoria } = require('../models');

//obtenerProductos - paginado - total - populate (JOIN)
const obtenerProductos = async(req = request, res=response) =>{
    const {limite = 5, desde = 0} = req.query; //Params

    const query = { estado: true};
    
    const [total , productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ]);
    
    res.json({
        total, 
        productos
    });
}

//obtenerProducto - populate {}
const obtenerProducto = async (req = request, res = response) =>{
    const {id} = req.params;
    
    await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .then(cat => {
            res.json(cat);
        });
}

//crearProducto
const crearProducto = async(req = request, res = response) => {
    
    let {nombre, categoria, precio, descripcion} = req.body;

    nombre = nombre.toUpperCase();
    categoria = categoria.toUpperCase();

    const productoDB = await Producto.findOne({nombre});

    if( productoDB ){
        return res.status(400).json({
            msg: `El producto ${ nombre }, ya existe`
        });
    }

    const cat = Categoria.findById(categoria);
    if( !cat ){
        return res.status(400).json({
            msg: `La categoria ${cat}, no es valida o no esta registrada`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
        precio,
        categoria,
        descripcion
    }

    const producto = await Producto(data);

    //Guardar db
    await producto.save();

    res.status(201).json(producto);
}

//actualizarProducto - 
const actualizarProducto = async (req = request, res = response) =>{
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const nombre = data.nombre;

    const verCat = await Producto.findOne({nombre});

    if(verCat){
        return res.status(400).json({
            msg: `El producto ${nombre} ya existe`
        })
    }

    const cat = Categoria.findById(data.categoria);
    if( !cat ){
        return res.status(400).json({
            msg: `La categoria ${cat}, no es valida o no esta registrada`
        });
    }

    const producto = await Producto.findByIdAndUpdate(id, data, {new : true});

    res.json({producto});
}

//borrarProducto - estado : false
const borrarProducto = async(req = request, res = response) => {
    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado: false, disponible: false}, {new : true})
    const usuarioLogueado = req.usuario;

    res.json({producto,usuarioLogueado});
}

module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
}