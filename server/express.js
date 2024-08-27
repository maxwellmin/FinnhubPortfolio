import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import apiRoutes from './routes/api.js';  // Import the routes

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create the MySQL pool connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mrp19990511ASD',
  database: 'dashboard'
});

// Use the API routes and pass the pool to them
app.use('/api', apiRoutes(pool));  // This will add the /api prefix to your routes

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});