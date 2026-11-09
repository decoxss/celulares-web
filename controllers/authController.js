const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

async function registro(req, res) {
    try {
        const { nombre, email, password } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'faltan datos' });
        }
        if (await Usuario.buscarPorEmail(email)) {
            return res.status(409).json({ error: 'ese correo ya esta registrado' });
        }
        const hash = await bcrypt.hash(password, 10);
        await Usuario.crear(nombre, email, hash);
        res.status(201).json({ mensaje: 'usuario registrado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.buscarPorEmail(email);
        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.status(401).json({ error: 'correo o contraseña incorrectos' });
        }
        req.session.usuario = { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol };
        res.json(req.session.usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function logout(req, res) {
    req.session.destroy(() => res.json({ mensaje: 'sesion cerrada' }));
}

function sesion(req, res) {
    if (!req.session.usuario) return res.status(401).json({ error: 'sin sesion' });
    res.json(req.session.usuario);
}

module.exports = { registro, login, logout, sesion };