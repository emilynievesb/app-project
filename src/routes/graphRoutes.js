import express from 'express';
import {
    getIncomeVsExpensesByMonth,
    getExpensesDistributionByCategory,
    getMonthlyBalanceEvolution,
    getExpensesByCategoryInDateRange,
    getTop5CategoriesByExpenses,
} from '../controllers/graphController.js';

const router = express.Router();

// Ruta para obtener Ingresos vs Egresos por mes para un usuario específico
router.get('/income-vs-expenses/:userID', getIncomeVsExpensesByMonth);

// Ruta para obtener distribución de gastos por categoría para un usuario específico
router.get('/expenses-distribution/:userID', getExpensesDistributionByCategory);

// Ruta para obtener la evolución del saldo mensual para un usuario específico
router.get('/monthly-balance/:userID', getMonthlyBalanceEvolution);

// Ruta para obtener gastos por categoría en un rango de fechas para un usuario específico
router.get('/expenses-by-category/:userID', getExpensesByCategoryInDateRange);

// Ruta para obtener el top 5 de categorías con más gastos para un usuario específico
router.get('/top5-categories-expenses/:userID', getTop5CategoriesByExpenses);

export default router;
