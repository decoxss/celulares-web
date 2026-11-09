const express = require('express');
const path = require('path');
const session = require('express-session');
const { conectar } = require('./config/database');
const rutasCelulares = require('./routes/celulares');
const rutasAuth = require('./routes/auth');
const rutasPedidos = require('./routes/pedidos');
const rutasUsuarios = require('./routes/usuarios');
const rutasDashboard = require('./routes/dashboard');

const app = express();
const puerto = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(express.json());

app.use(session({
    secret: 'cambia-esta-por-una-clave-larga-y-propia',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/celulares', rutasCelulares);
app.use('/api/auth', rutasAuth);
app.use('/api/pedidos', rutasPedidos);
app.use('/api/usuarios', rutasUsuarios);
app.use('/api/estadisticas', rutasDashboard);

async function iniciar() {
    try {
        await conectar();
        console.log('conexion con sql server exitosa');

        app.listen(puerto, () => {
            console.log(`cellstore disponible en http://localhost:${puerto}`);
        });
    } catch (error) {
        console.error('error de conexion:', error.message);
        process.exit(1);
    }
}

iniciar();