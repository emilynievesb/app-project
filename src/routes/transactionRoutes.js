import express from 'express';
import {
    addTransaction,
    getTransactionsByUserId,
    deleteTransaction,
    getTransactionsWithPagination,
    editTransaction,
} from '../controllers/transactionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'; // Middleware para proteger rutas

const router = express.Router();

router.post('/', authMiddleware, addTransaction);
router.get('/usuario/:id', authMiddleware, getTransactionsByUserId);
router.get('/pag/usuario/:id', authMiddleware, getTransactionsWithPagination);
router.delete('/:id', authMiddleware, deleteTransaction);
router.put('/:transactionID', editTransaction);

export default router;
