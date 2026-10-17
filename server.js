const express = require('express');
const path = require('path');
const { conectar } = require('./config/database');
const rutasCelulares = require('./routes/celulares');

const app = express();
const puerto = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/celulares', rutasCelulares);

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
