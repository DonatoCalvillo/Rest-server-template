const { Categoria } = require("../models");

const validarId = async(id) => {
    const existeId = await Categoria.findById(id);
    if(!existeId){
        throw new Error(`El id: ${id}, no existe`);
    }
}

module.exports = {
    validarId
}