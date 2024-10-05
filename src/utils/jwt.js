import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET; // Secreto para firmar los tokens

// Genera un token JWT con un payload que incluye el ID del usuario
export const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, SECRET, {
        expiresIn: '1h', // El token expira en 1 hora
    });
};

// Verifica la validez del token y extrae el payload
export const verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};
