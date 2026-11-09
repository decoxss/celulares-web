const Pedido = require('../models/pedido');

async function crear(req, res) {
    try {
        const items = req.body.items;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'el carrito esta vacio' });
        }

        const validos = items.every(i =>
            Number.isInteger(i.id) && Number.isInteger(i.cantidad) && i.cantidad > 0
        );
        if (!validos) {
            return res.status(400).json({ error: 'datos del carrito invalidos' });
        }

        const pedido = await Pedido.crear(req.session.usuario.id, items);
        res.status(201).json(pedido);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
}

async function obtener(req, res) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: 'pedido invalido' });
        }

        const pedido = await Pedido.obtener(id);
        if (!pedido) {
            return res.status(404).json({ error: 'pedido no encontrado' });
        }

        // un usuario solo ve sus pedidos; el admin ve todos
        const u = req.session.usuario;
        if (u.rol !== 'admin' && Number(pedido.usuario_id) !== Number(u.id)) {
            return res.status(403).json({ error: 'no puedes ver este pedido' });
        }

        res.json(pedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { crear, obtener };
