// backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth'); 

router.use(authMiddleware);

// Get user notifications
router.get('/recent', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [notifications] = await connection.query(
      `SELECT 
        id,
        title,
        message,
        type,
        is_read,
        created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 3`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  } finally {
    if (connection) connection.release();
  }
});

// Get all notifications
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [notifications] = await connection.query(
      `SELECT 
        id,
        title,
        message,
        type,
        is_read,
        created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  } finally {
    if (connection) connection.release();
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    await connection.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification'
    });
  } finally {
    if (connection) connection.release();
  }
});

router.put('/read-all', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    await connection.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
      [req.user.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications'
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;