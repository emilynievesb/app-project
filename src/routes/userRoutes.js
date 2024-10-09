import express from 'express';
import { createUser, getUserByUsername, loginUser, logoutUser } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createUser); // Crear un nuevo usuario
router.post('/login', loginUser); // Login
router.post('/logout', logoutUser); // Cerrar sesión
router.get('/:username', getUserByUsername); // Obtener usuario por username

export default router;
