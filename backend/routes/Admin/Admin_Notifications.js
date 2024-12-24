const express = require('express');
const router = express.Router();
const pool = require('../../config/database');
const authMiddleware = require('../../middleware/auth');

router.post('/send', authMiddleware, async (req, res) => {
  let connection;
  try {
    const { title, message, filters } = req.body;
    const { bloodType, area } = filters;

    connection = await pool.getConnection();

    // Build query based on filters and notification preferences
    let query = `
      SELECT DISTINCT u.id
      FROM users u
      JOIN user_profiles up ON u.id = up.user_id
      WHERE 1=1
      AND (
        (up.notification_preference = 'receiveAll')
        OR (up.notification_preference = 'receiveAreaOnly' AND up.area = ?)
      )
    `;
    const queryParams = [area];

    if (bloodType) {
      query += ` AND (up.blood_type = ? OR up.blood_type = 'UNKNOWN')`;
      queryParams.push(bloodType);
    }

    if (area) {
      query += ` AND (up.area = ? OR up.notification_preference = 'receiveAll')`;
      queryParams.push(area);
    }

    // Exclude users who have opted out
    query += ` AND up.notification_preference != 'receiveNone'`;

    // Get users matching filters
    const [users] = await connection.query(query, queryParams);

    // Create notifications for matched users
    if (users.length > 0) {
      const notifications = users.map(user => [
        user.id,
        title,
        message,
        'info',
        0, // is_read set to false
        new Date()
      ]);

      await connection.query(
        `INSERT INTO notifications 
         (user_id, title, message, type, is_read, created_at)
         VALUES ?`,
        [notifications]
      );
    }

    res.json({
      success: true,
      message: `Notification sent to ${users.length} users`,
      recipientCount: users.length
    });

  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notifications'
    });
  } finally {
    if (connection) connection.release();
  }
});

router.get('/all', authMiddleware, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    const [notifications] = await connection.query(`
      SELECT n.*, u.name as user_name, up.blood_type, up.area
      FROM notifications n
      JOIN users u ON n.user_id = u.id
      JOIN user_profiles up ON u.id = up.user_id
      ORDER BY n.created_at DESC
    `);

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

router.post('/check-recipients', authMiddleware, async (req, res) => {
    let connection;
    try {
      const { filters } = req.body;
      const { bloodType, area } = filters;
  
      connection = await pool.getConnection();
  
      let query = `
        SELECT COUNT(DISTINCT u.id) as count
        FROM users u
        JOIN user_profiles up ON u.id = up.user_id
        WHERE 1=1
      `;
      const queryParams = [];
  
      // Add notification preference conditions
      if (area) {
        query += ` AND (
          up.notification_preference = 'receiveAll'
          OR (up.notification_preference = 'receiveAreaOnly' AND up.area = ?)
        )`;
        queryParams.push(area);
      } else {
        query += ` AND up.notification_preference = 'receiveAll'`;
      }
  
      // Add blood type filter
      if (bloodType) {
        query += ` AND (up.blood_type = ? OR up.blood_type = 'UNKNOWN')`;
        queryParams.push(bloodType);
      }
  
      // Add area filter
      if (area) {
        query += ` AND up.area = ?`;
        queryParams.push(area);
      }
  
      // Exclude users who opted out
      query += ` AND up.notification_preference != 'receiveNone'`;
  
      const [result] = await connection.query(query, queryParams);
  
      res.json({
        success: true,
        recipientCount: result[0].count
      });
  
    } catch (error) {
      console.error('Error checking recipients:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check recipients'
      });
    } finally {
      if (connection) connection.release();
    }
  });

module.exports = router;