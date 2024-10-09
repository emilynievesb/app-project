import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Leer el token desde la cookie
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'No estás autenticado' });
    }

    try {
        const user = verifyToken(token); // Verificar el token
        req.user = user; // Almacenar el usuario verificado en la petición
        next(); // Continuar con la siguiente función
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};
