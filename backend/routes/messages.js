// routes/messages.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.post('/submit', async (req, res) => {
    let connection;
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        connection = await pool.getConnection();
        
        const [result] = await connection.query(
            `INSERT INTO messages (name, email, subject, message) 
            VALUES (?, ?, ?, ?)`,
            [name, email, subject, message]
        );

        res.json({
            success: true,
            message: 'Message sent successfully',
            messageId: result.insertId
        });

    } catch (error) {
        console.error('Error submitting message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;