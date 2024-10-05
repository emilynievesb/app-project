import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import graphRoutes from './routes/graphRoutes.js';

const app = express();

// Configuración de CORS
app.use(
    cors({
        origin: process.env.FRONT_URL, // Cambia esto a la URL de tu frontend
        credentials: true, // Permitir el envío de cookies (importante para el manejo de JWT en cookies)
    })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/usuarios', userRoutes);

app.use('/api/transacciones', transactionRoutes);

app.use('/api/graficos', graphRoutes);

export default app;
