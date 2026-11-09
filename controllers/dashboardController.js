const Dashboard = require('../models/dashboard');

async function estadisticas(req, res) {
    try {
        const [resumen, ventas, vendidos, bajo] = await Promise.all([
            Dashboard.resumen(),
            Dashboard.ventasPorDia(),
            Dashboard.masVendidos(),
            Dashboard.stockBajo()
        ]);

        res.json({
            resumen: {
                ventas: Number(resumen.ventas),
                pedidos: Number(resumen.pedidos),
                usuarios: Number(resumen.usuarios),
                stockBajo: Number(resumen.stock_bajo)
            },
            ventasPorDia: ventas.map(v => ({
                dia: v.dia,
                total: Number(v.total),
                pedidos: Number(v.pedidos)
            })),
            masVendidos: vendidos.map(v => ({
                nombre: v.nombre,
                unidades: Number(v.unidades)
            })),
            stockBajo: bajo.map(b => ({ nombre: b.nombre, stock: Number(b.stock) }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { estadisticas };