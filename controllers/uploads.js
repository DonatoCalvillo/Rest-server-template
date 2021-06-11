const path = require('path');
const fs = require('fs');
const { request, response } = require("express");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require('../models');


const cargarArchivo = async(req = request, res= response) => {
  
  try {
    const nombre = await subirArchivo( req.files, undefined, 'imgs' ); 
    res.json({ nombre })
    
  } catch (err) {
    res.status(400).json({ err });
  }

}

const actualizarImg = async(req, res) =>{

  const {id, coleccion} = req.params;
  
  let modelo;

  switch(coleccion){
    case 'usuarios':
      modelo = await Usuario.findById(id);
      
      if(!modelo){
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break;
    case 'productos':
      modelo = await Producto.findById(id);
      
      if(!modelo){
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        })
      }

      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto '})
  };

  //Limpiar imagenes previas
  if( modelo.imagen ){
    //Hay que borrar la imagen del servidor
    const pathImg = path.join(__dirname, '../uploads/', coleccion, modelo.imagen);
    if(fs.existsSync( pathImg )){
      fs.unlinkSync( pathImg );
    }
  }

  const nombre = await subirArchivo( req.files, undefined, coleccion ); 
  modelo.imagen = nombre;

  await modelo.save();

  res.json(modelo);
}

const actualizarImgCloudinary = async(req, res) =>{

  const {id, coleccion} = req.params;
  
  let modelo;

  switch(coleccion){
    case 'usuarios':
      modelo = await Usuario.findById(id);
      
      if(!modelo){
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break;
    case 'productos':
      modelo = await Producto.findById(id);
      
      if(!modelo){
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        })
      }

      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto '})
  };

  //Limpiar imagenes previas
  if( modelo.imagen ){
    //Hay que borrar la imagen del servidor
    const nombreArr = modelo.imagen.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [ public_id ] =nombre.split('.');
    cloudinary.uploader.destroy( public_id );
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

  modelo.imagen = secure_url;

  await modelo.save();

  res.json(modelo);
}

const mostrarImagen = async(req, res) => {
  const {id, coleccion} = req.params;
  
  let modelo;

  switch(coleccion){
    case 'usuarios':
      modelo = await Usuario.findById(id);
      
      if(!modelo){
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break;
    case 'productos':
      modelo = await Producto.findById(id);
      
      if(!modelo){
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        })
      }

      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto '})
  };

  //Limpiar imagenes previas
  if( modelo.imagen ){
    //Hay que borrar la imagen del servidor
    const pathImg = path.join(__dirname, '../uploads/', coleccion, modelo.imagen);
    if(fs.existsSync( pathImg )){
      return res.sendFile(pathImg);
    }
  }

  const pathNotFound = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathNotFound);
  
}

module.exports = {
  cargarArchivo,
  actualizarImg,
  mostrarImagen,
  actualizarImgCloudinary
}