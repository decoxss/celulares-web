const Celular = require('../models/celular');

class CelularController {
    static async listar(req, res) {
        try {
            const celulares = await Celular.obtenerTodos();
            res.json(celulares);
        } catch (error) {
            console.error('Error al consultar celulares:', error.message);
            res.status(500).json({
                mensaje: 'No se pudieron consultar los celulares'
            });
        }
    }
}

module.exports = CelularController;
