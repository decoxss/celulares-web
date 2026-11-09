function requiereLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json({ error: 'debes iniciar sesion' });
    }
    next();
}

function requiereAdmin(req, res, next) {
    if (!req.session.usuario || req.session.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'solo el administrador puede hacer esto' });
    }
    next();
}

module.exports = { requiereLogin, requiereAdmin };