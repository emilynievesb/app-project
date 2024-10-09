import pool from '../utils/db.js';

export const addTransaction = async (req, res) => {
    const { usuario_id, tipo_id, categoria_id, fecha, monto, descripcion } = req.body;
    try {
        const [result] = await pool.query(`INSERT INTO transacciones (usuario_id, tipo_id, categoria_id,monto,fecha, descripcion) VALUES (?, ?, ?, ?, ?, ?)`, [
            usuario_id,
            tipo_id,
            categoria_id,
            monto,
            fecha,
            descripcion,
        ]);
        res.status(201).json({ message: 'Transacción agregada', transactionId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTransactionsByUserId = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`SELECT * FROM transacciones WHERE usuario_id = ?`, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron transacciones' });
        }
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTransactionsWithPagination = async (req, res) => {
    const userID = req.params.id;
    const page = parseInt(req.query.page) || 1; // Página actual (por defecto es 1)
    const limit = 10; // Número de transacciones por página (fijo en 10)
    const offset = (page - 1) * limit;

    try {
        // Contar el total de transacciones del usuario
        const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM transacciones WHERE usuario_id = ?`, [userID]);
        const total = countResult[0].total; // Total de transacciones del usuario

        // Obtener las transacciones del usuario con paginación
        const [rows] = await pool.query(
            `SELECT t.*, tt.tipo,c.categoria 
            FROM transacciones t 
            JOIN tipos_transaccion tt ON t.tipo_id = tt.id
            JOIN categorias c ON t.categoria_id = c.id  
            WHERE t.usuario_id = ? 
            ORDER BY t.fecha DESC 
            LIMIT ? OFFSET ?`,
            [userID, limit, offset]
        );

        // Calcular el total de páginas
        const totalPages = Math.ceil(total / limit);
        // Devolver los datos con paginación
        res.status(200).json({
            page,
            totalPages,
            totalRecords: total,
            transactions: rows,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las transacciones' });
    }
};

export const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query(`DELETE FROM transacciones WHERE id = ?`, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }
        res.status(200).json({ message: 'Transacción eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para editar una transacción existente
export const editTransaction = async (req, res) => {
    const { transactionID } = req.params; // Obtenemos el ID de la transacción desde los parámetros de la URL
    const { monto, descripcion, fecha, tipo_id, categoria_id } = req.body; // Datos que queremos actualizar
    console.log({ monto, descripcion, fecha, tipo_id, categoria_id });
    try {
        // Verificar si la transacción existe
        const [existingTransaction] = await pool.query('SELECT * FROM transacciones WHERE id = ?', [transactionID]);

        if (existingTransaction.length === 0) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        // Actualizar la transacción
        const r = await pool.query(
            `
            UPDATE transacciones
            SET monto = ?, descripcion = ?, fecha = ?, tipo_id = ?, categoria_id = ?
            WHERE id = ?
        `,
            [monto, descripcion, fecha, tipo_id, categoria_id, transactionID]
        );

        res.status(200).json({ message: 'Transacción actualizada exitosamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar la transacción', error: error.message });
    }
};
