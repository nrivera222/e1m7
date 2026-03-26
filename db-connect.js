// =============================================
// db-connect.js
// E1-M7 - Configuración de Conexión a PostgreSQL
// =============================================

const { Pool } = require('pg');
require('dotenv').config();   // Para leer el archivo .env

// Configuración del Pool de conexiones
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 5432,
});

// Función para verificar la conexión
async function verificarConexion() {
    let client;
    try {
        client = await pool.connect();
        
        console.log('✅ ¡Conexión a PostgreSQL exitosa!');
        console.log(`   Usuario: ${process.env.DB_USER}`);
        console.log(`   Base de datos: ${process.env.DB_NAME}`);
        console.log(`   Host: ${process.env.DB_HOST}`);
        console.log(`   Puerto: ${process.env.DB_PORT || 5432}`);

        // Prueba adicional: consultar versión de PostgreSQL
        const res = await client.query('SELECT version()');
        console.log('\n   PostgreSQL versión:', res.rows[0].version.split(' on ')[0]);

    } catch (err) {
        console.error('❌ Error al conectar a la base de datos:');
        console.error(err.message);

        // Mensajes de ayuda según el tipo de error
        if (err.code === '28P01') {
            console.error('\n💡 La contraseña es incorrecta. Verifica tu archivo .env');
        } else if (err.code === '3D000') {
            console.error('\n💡 La base de datos no existe. Créala primero en pgAdmin.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('\n💡 PostgreSQL no está corriendo. Inicia el servicio.');
        }
    } finally {
        // Siempre liberamos la conexión
        if (client) {
            client.release();
        }
    }
}

// Ejecutar la verificación
verificarConexion();