const { request, response } = require("express");
const {Categoria} = require("../models");

//obtenerCategorias - paginado - total - populate (JOIN)
const obtenerCategorias = async(req = request, res=response) =>{
    const {limite = 5, desde = 0} = req.query; //Params

    const query = { estado: true};
    
    const [total ,categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
    ]);
    
    res.json({
        total, 
        categorias
    });
}

//ObtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res = response) =>{
    const {id} = req.params;
    
    await Categoria.findById(id)
        .populate('usuario', 'nombre')
        .then(cat => {
            res.json(cat);
        });
}

//crearCategoria
const crearCategoria = async(req = request, res = response) => {
    
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });

    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await Categoria(data);

    //Guardar db
    await categoria.save();

    res.status(201).json(categoria)
}

//actualizarCategoria - 
const actualizarCategoria = async (req = request, res = response) =>{
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const nombre = data.nombre;

    const verCat = await Categoria.findOne({nombre});

    if(verCat){
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe`
        })
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new : true});

    res.json({categoria});
}

//borrarCategoria - estado : false
const borrarCategoria = async(req = request, res = response) => {
    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new : true})
    const usuarioLogueado = req.usuario;

    res.json({categoria,usuarioLogueado});
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}