const { sql } = require('../config/database');

function errorHttp(status, mensaje) {
    const e = new Error(mensaje);
    e.status = status;
    return e;
}

async function crear(usuarioId, items) {
    const tx = new sql.Transaction();
    await tx.begin();

    try {
        const pedido = await new sql.Request(tx)
            .input('usuario', sql.Int, usuarioId)
            .query(`insert into pedidos (usuario_id) output inserted.id values (@usuario)`);
        const pedidoId = pedido.recordset[0].id;

        let total = 0;

        for (const item of items) {
            // descuenta stock solo si alcanza
            const upd = await new sql.Request(tx)
                .input('id', sql.Int, item.id)
                .input('cant', sql.Int, item.cantidad)
                .query(`update celulares set stock = stock - @cant
                        where id = @id and stock >= @cant`);

            if (upd.rowsAffected[0] === 0) {
                throw errorHttp(409, 'Un producto ya no tiene existencias suficientes o no existe.');
            }

            // el precio sale de la base de datos, no del navegador
            const precio = await new sql.Request(tx)
                .input('id', sql.Int, item.id)
                .query('select precio from celulares where id = @id');
            const precioUnitario = Number(precio.recordset[0].precio);

            await new sql.Request(tx)
                .input('pedido', sql.Int, pedidoId)
                .input('celular', sql.Int, item.id)
                .input('cant', sql.Int, item.cantidad)
                .input('precio', sql.Decimal(10, 2), precioUnitario)
                .query(`insert into detalle_pedido (pedido_id, celular_id, cantidad, precio_unitario)
                        values (@pedido, @celular, @cant, @precio)`);

            total += precioUnitario * item.cantidad;
        }

        await new sql.Request(tx)
            .input('id', sql.Int, pedidoId)
            .input('total', sql.Decimal(10, 2), total)
            .query('update pedidos set total = @total where id = @id');

        await tx.commit();
        return { id: pedidoId, total };
    } catch (error) {
        await tx.rollback();
        throw error;
    }
}

async function obtener(id) {
    const cabecera = await new sql.Request()
        .input('id', sql.Int, id)
        .query(`select p.id, p.fecha, p.total, p.usuario_id, u.nombre, u.email
                from pedidos p
                join usuarios u on u.id = p.usuario_id
                where p.id = @id`);

    const pedido = cabecera.recordset[0];
    if (!pedido) return null;

    const detalle = await new sql.Request()
        .input('id', sql.Int, id)
        .query(`select c.marca, c.modelo, d.cantidad, d.precio_unitario
                from detalle_pedido d
                join celulares c on c.id = d.celular_id
                where d.pedido_id = @id`);

    pedido.items = detalle.recordset;
    return pedido;
}

module.exports = { crear, obtener };

