const { sql } = require('../config/database');

async function resumen() {
    const r = await new sql.Request().query(`
        select
            (select isnull(sum(total), 0) from pedidos) as ventas,
            (select count(*) from pedidos) as pedidos,
            (select count(*) from usuarios) as usuarios,
            (select count(*) from celulares where stock <= 3) as stock_bajo
    `);
    return r.recordset[0];
}

async function ventasPorDia() {
    const r = await new sql.Request().query(`
        select convert(varchar(10), fecha, 23) as dia,
               sum(total) as total,
               count(*) as pedidos
        from pedidos
        where fecha >= dateadd(day, -29, convert(date, getdate()))
        group by convert(varchar(10), fecha, 23)
        order by dia
    `);
    return r.recordset;
}

async function masVendidos() {
    const r = await new sql.Request().query(`
        select top 5 c.marca + ' ' + c.modelo as nombre,
               sum(d.cantidad) as unidades
        from detalle_pedido d
        join celulares c on c.id = d.celular_id
        group by c.marca, c.modelo
        order by unidades desc
    `);
    return r.recordset;
}

async function stockBajo() {
    const r = await new sql.Request().query(`
        select marca + ' ' + modelo as nombre, stock
        from celulares
        where stock <= 3
        order by stock
    `);
    return r.recordset;
}

module.exports = { resumen, ventasPorDia, masVendidos, stockBajo };