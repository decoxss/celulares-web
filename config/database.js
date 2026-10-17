
const sql = require('mssql/msnodesqlv8');

const configuracion = {
    connectionString: 'Driver={ODBC Driver 18 for SQL Server};Server=localhost\\SQLEXPRESS;Database=CellStore;Trusted_Connection=Yes;TrustServerCertificate=Yes;'
};

const conectar = async () => {
    return await sql.connect(configuracion);
};

module.exports = { sql, conectar };
