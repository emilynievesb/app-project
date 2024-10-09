import express from 'express';
import {
    addTransaction,
    getTransactionsByUserId,
    deleteTransaction,
    getTransactionsWithPagination,
    editTransaction,
} from '../controllers/transactionController.js';
// import { authMiddleware } from '../middlewares/authMiddleware.js'; // Middleware para proteger rutas

const router = express.Router();

router.post('/', addTransaction);
router.get('/usuario/:id', getTransactionsByUserId);
router.get('/pag/usuario/:id', getTransactionsWithPagination);
router.delete('/:id', deleteTransaction);
router.put('/:transactionID', editTransaction);

export default router;
