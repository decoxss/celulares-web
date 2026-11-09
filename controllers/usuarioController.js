const Usuario = require('../models/usuario');

async function listar(req, res) {
    try {
        res.json(await Usuario.listar());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function cambiarRol(req, res) {
    try {
        const id = Number(req.params.id);
        const { rol } = req.body;

        if (!Number.isInteger(id) || !['admin', 'usuario'].includes(rol)) {
            return res.status(400).json({ error: 'datos invalidos' });
        }
        if (id === Number(req.session.usuario.id)) {
            return res.status(400).json({ error: 'no puedes cambiar tu propio rol' });
        }

        const filas = await Usuario.cambiarRol(id, rol);
        if (!filas) return res.status(404).json({ error: 'usuario no encontrado' });
        res.json({ mensaje: 'rol actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function eliminar(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: 'usuario invalido' });
        }
        if (id === Number(req.session.usuario.id)) {
            return res.status(400).json({ error: 'no puedes eliminar tu propia cuenta' });
        }

        const filas = await Usuario.eliminar(id);
        if (!filas) return res.status(404).json({ error: 'usuario no encontrado' });
        res.json({ mensaje: 'usuario eliminado' });
    } catch (error) {
        // 547 = el usuario tiene pedidos y no se puede borrar
        if (error.number === 547 || /REFERENCE/i.test(error.message)) {
            return res.status(409).json({ error: 'este usuario tiene pedidos y no se puede eliminar' });
        }
        res.status(500).json({ error: error.message });
    }
}

module.exports = { listar, cambiarRol, eliminar };