const sql = require('mssql');

const configuracion = {
    server: 'localhost',
    database: 'CellStore',
    user: 'TU_USUARIO_SQL',
    password: 'TU_PASSWORD_SQL',
    options: { trustServerCertificate: true, encrypt: false, instanceName: 'SQLEXPRESS' }
};

const conectar = async () => await sql.connect(configuracion);

module.exports = { sql, conectar };