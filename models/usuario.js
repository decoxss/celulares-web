const { sql } = require('../config/database');

async function crear(nombre, email, passwordHash) {
    const r = await new sql.Request()
        .input('nombre', sql.VarChar(100), nombre)
        .input('email', sql.VarChar(100), email)
        .input('password', sql.VarChar(100), passwordHash)
        .query(`insert into usuarios (nombre, email, password, rol)
                output inserted.id
                values (@nombre, @email, @password, 'usuario')`);
    return r.recordset[0].id;
}

async function buscarPorEmail(email) {
    const r = await new sql.Request()
        .input('email', sql.VarChar(100), email)
        .query('select * from usuarios where email = @email');
    return r.recordset[0];
}

async function listar() {
    const r = await new sql.Request()
        .query('select id, nombre, email, rol from usuarios order by id');
    return r.recordset;
}

async function cambiarRol(id, rol) {
    const r = await new sql.Request()
        .input('id', sql.Int, id)
        .input('rol', sql.VarChar(10), rol)
        .query('update usuarios set rol = @rol where id = @id');
    return r.rowsAffected[0];
}

async function eliminar(id) {
    const r = await new sql.Request()
        .input('id', sql.Int, id)
        .query('delete from usuarios where id = @id');
    return r.rowsAffected[0];
}

module.exports = { crear, buscarPorEmail, listar, cambiarRol, eliminar };