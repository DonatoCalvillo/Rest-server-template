const { Producto, 
    Usuario 
} = require('../models');

const Role = require('../models/role')

const esRolValido = async (rol = '') =>{
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta definido en la db`);
    }
}

const emailExiste = async(correo = '') =>{
    //Verificar si el correo existe
   const existeCorreo = await Usuario.findOne({correo});
   if(existeCorreo){
       throw new Error(`El correo: ${correo}, ya esta registrado`);
   }
}

const usuarioPorIdExiste = async( id ) =>{
    //Verificar si el correo existe
   const existeId = await Usuario.findById(id);
   if(!existeId){
       throw new Error(`El id: ${id}, no existe`);
   }
}

const productoPorIdExiste = async (id)=>{
   //Verificar si el producto existe
   const existeId = await Producto.findById(id);
   if(!existeId){
       throw new Error(`El id: ${id}, no existe`);
   }
}

module.exports = {
    esRolValido,
    emailExiste,
    usuarioPorIdExiste,
    productoPorIdExiste
}