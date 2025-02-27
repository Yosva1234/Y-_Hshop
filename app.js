const express = require('express');
const path = require('path');
const mysql = require('mysql2'); // Importar mysql2
const cors = require('cors'); // Para permitir solicitudes desde el frontend

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del pool de conexiones a MySQL
const pool = mysql.createPool({
  host: 'bajha1aig69hxddhmuba-mysql.services.clever-cloud.com', // Dirección del servidor de la base de datos
  user: 'ulzgopm4nysnylob', // Usuario de la base de datos
  password: 'MHrcAEuCvfUWJ0GvGNiH', // Contraseña del usuario
  database: 'bajha1aig69hxddhmuba', // Nombre de la base de datos
  waitForConnections: true, // Esperar si no hay conexiones disponibles
  connectionLimit: 10, // Número máximo de conexiones en el pool
  queueLimit: 0 // Número máximo de solicitudes en cola (0 = sin límite)
});

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Para parsear el cuerpo de las solicitudes JSON

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener todas las bebidas
app.get('/bebidas', (req, res) => {
  const query = 'SELECT * FROM bebidas'; // Consulta para obtener todas las bebidas

  // Usar el pool para ejecutar la consulta
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err.stack);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json(results); // Enviar los resultados como JSON
  });
});

// Ruta para agregar una nueva bebida
app.post('/bebidas', (req, res) => {
  const { nombre, precio, info, imagen } = req.body; // Obtener los datos del cuerpo de la solicitud

  // Validar que todos los campos estén presentes
  if (!nombre || !precio || !info || !imagen) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const query = 'INSERT INTO bebidas (nombre, precio, info, imagen) VALUES (?, ?, ?, ?)'; // Consulta para insertar una nueva bebida

  // Usar el pool para ejecutar la consulta
  pool.query(query, [nombre, precio, info, imagen], (err, results) => {
    if (err) {
      console.error('Error al agregar la bebida:', err.stack);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    // Respuesta exitosa con el ID de la nueva bebida
    res.status(201).json({ message: 'Bebida agregada correctamente', id: results.insertId });
  });
});

// Ruta para eliminar una bebida por su ID
app.delete('/bebidas/:id', (req, res) => {
  const { id } = req.params; // Obtener el ID de la bebida desde los parámetros de la URL

  const query = 'DELETE FROM bebidas WHERE id = ?'; // Consulta para eliminar la bebida

  // Usar el pool para ejecutar la consulta
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar la bebida:', err.stack);
      res.status(500).send('Error en el servidor');
      return;
    }

    if (results.affectedRows === 0) {
      // Si no se eliminó ninguna fila, la bebida no existe
      res.status(404).json({ error: 'Bebida no encontrada' });
      return;
    }

    res.json({ message: 'Bebida eliminada correctamente' }); // Respuesta exitosa
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Cerrar el pool al detener la aplicación
process.on('SIGINT', () => {
  pool.end(); // Cerrar el pool de conexiones
  process.exit(); // Salir de la aplicación
});