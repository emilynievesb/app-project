import pool from '../utils/db.js';

// 1. Gráfico de barras: Ingresos vs Egresos por mes
export const getIncomeVsExpensesByMonth = async (req, res) => {
    const { userID } = req.params; // Obtenemos el ID del usuario desde los parámetros de la ruta
    try {
        const [rows] = await pool.query(
            `
                SELECT
                MONTH(t.fecha) AS mes,
                YEAR(t.fecha) AS año,
                SUM(CASE WHEN t.tipo_id = 1 THEN t.monto ELSE 0 END) AS ingresos,
                SUM(CASE WHEN t.tipo_id = 2 THEN t.monto ELSE 0 END) AS egresos
            FROM transacciones t
            WHERE t.usuario_id = ?
            AND t.fecha >= DATE_SUB(NOW(), INTERVAL 12 MONTH)  -- Solo traer datos de los últimos 12 meses
            GROUP BY mes, año
            ORDER BY año, mes;
        `,
            [userID]
        );

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ingresos y egresos por mes', error: error.message });
    }
};

// 2. Gráfico circular: Distribución de gastos por categoría
export const getExpensesDistributionByCategory = async (req, res) => {
    const { userID } = req.params;
    try {
        const [rows] = await pool.query(
            `
            SELECT
                c.categoria AS categoria,
                SUM(t.monto) AS total_gastos
            FROM transacciones t
            JOIN categorias c ON t.categoria_id = c.id
            WHERE t.tipo_id = 2  -- Solo egresos
            AND t.usuario_id = ?
            AND YEAR(t.fecha) = YEAR(NOW())  -- Solo año actual
            AND MONTH(t.fecha) = MONTH(NOW())  -- Solo mes actual
            GROUP BY categoria
        `,
            [userID]
        );

        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener distribución de gastos por categoría', error: error.message });
    }
};

// 3. Gráfico de líneas: Evolución de saldo mensual
export const getMonthlyBalanceEvolution = async (req, res) => {
    const { userID } = req.params;
    try {
        const [rows] = await pool.query(
            `
                SELECT
                MONTH(t.fecha) AS mes,
                YEAR(t.fecha) AS año,
                (SUM(CASE WHEN t.tipo_id = 1 THEN t.monto ELSE 0 END) - SUM(CASE WHEN t.tipo_id = 2 THEN t.monto ELSE 0 END)) AS saldo_mensual
            FROM transacciones t
            WHERE t.usuario_id = ?
            AND t.fecha >= DATE_SUB(NOW(), INTERVAL 12 MONTH)  -- Solo traer datos de los últimos 12 meses
            GROUP BY mes, año
            ORDER BY año, mes;        
        `,
            [userID]
        );

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la evolución del saldo mensual', error: error.message });
    }
};

// 4. Gráfico de barras: Comparación de gastos por categoría en un rango de fechas
export const getExpensesByCategoryInDateRange = async (req, res) => {
    const { userID } = req.params;

    try {
        const [rows] = await pool.query(
            `
            SELECT
                c.categoria AS categoria,
                SUM(t.monto) AS total_gastos
            FROM transacciones t
            JOIN categorias c ON t.categoria_id = c.id
            WHERE t.tipo_id = 2  -- Solo egresos
            AND t.usuario_id = ?
            AND YEAR(t.fecha) = YEAR(NOW())  -- Solo año actual
            AND MONTH(t.fecha) = MONTH(NOW())  -- Solo mes actual
            GROUP BY categoria
        `,
            [userID]
        );

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener gastos por categoría en el año actual', error: error.message });
    }
};

// 5. Gráfico de barras: Top 5 categorías con más gastos
export const getTop5CategoriesByExpenses = async (req, res) => {
    const { userID } = req.params;
    try {
        const [rows] = await pool.query(
            `
            SELECT
                c.categoria AS categoria,
                SUM(t.monto) AS total_gastos
            FROM transacciones t
            JOIN categorias c ON t.categoria_id = c.id
            WHERE t.tipo_id = 2  -- Solo egresos
            AND t.usuario_id = ?
            AND YEAR(t.fecha) = YEAR(NOW())  -- Solo año actual
            AND MONTH(t.fecha) = MONTH(NOW())  -- Solo mes actual
            GROUP BY categoria
            ORDER BY total_gastos DESC
            LIMIT 5
        `,
            [userID]
        );

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las 5 categorías con más gastos', error: error.message });
    }
};
