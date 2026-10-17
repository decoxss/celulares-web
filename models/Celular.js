const { conectar } = require('../config/database');

class Celular {
    static async obtenerTodos() {
        const conexion = await conectar();

        const resultado = await conexion
            .request()
            .query(`
                select id, marca, modelo, precio, stock
                from dbo.celulares
                order by id
            `);

        return resultado.recordset;
    }
}

module.exports = Celular;
