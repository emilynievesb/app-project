import bcrypt from 'bcrypt';
import pool from '../utils/db.js';
import { generateToken } from '../utils/jwt.js';

export const createUser = async (req, res) => {
    const { nombre, apellido, correo, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(`INSERT INTO usuarios (nombre, apellido, correo, username, password) VALUES (?, ?, ?, ?, ?)`, [
            nombre,
            apellido,
            correo,
            username,
            hashedPassword,
        ]);
        res.status(201).json({ message: 'Usuario creado', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserByUsername = async (req, res) => {
    const { username } = req.params;
    try {
        const [rows] = await pool.query(`SELECT * FROM usuarios WHERE username = ?`, [username]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar el usuario en la base de datos
        const [rows] = await pool.query(`SELECT * FROM usuarios WHERE username = ?`, [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = rows[0];

        // Comparar la contraseña hasheada
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token JWT si las credenciales son correctas
        const token = generateToken(user);

        // Configuramos la cookie con el token
        res.cookie('token', token, {
            httpOnly: true, // La cookie no puede ser accedida por JavaScript, solo por el servidor
            secure: true, // Solo se enviará sobre HTTPS (importante en producción)
            sameSite: 'strict', // Evita que se envíe en solicitudes cruzadas (más seguro)
            maxAge: 60 * 60 * 1000, // La cookie expirará en 1 hora
        });

        // Responder con un mensaje de éxito
        res.status(200).json({ userId: user.id, nombre: user.nombre + ' ' + user.apellido, username: user.username, message: 'Login exitoso' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const logoutUser = (req, res) => {
    try {
        // Limpiar la cookie con el JWT
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true, // Asegúrate de tener esto en producción
        });
        return res.status(200).json({ message: 'Logout exitoso' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
};
