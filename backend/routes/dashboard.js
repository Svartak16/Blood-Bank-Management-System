// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/notifications', async (req, res) => {
    let connection;
    try {
      connection = await pool.getConnection();
      
      const [results] = await connection.query(
        `SELECT 
          id,
          title,
          message,
          type,
          created_at as timestamp,
          is_read
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 20`,
        [req.user.id]
      );
  
      res.json({
        success: true,
        data: results
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

router.get('/stats', async (req, res) => {
  let connection;
  try {
      connection = await pool.getConnection();

      // Get total donors
      const [donors] = await connection.query(`
          SELECT COUNT(*) as total_donors 
          FROM users 
          WHERE role = 'user'
      `);

      // Get blood banks count
      const [bloodBanks] = await connection.query(`
          SELECT COUNT(*) as total_blood_banks 
          FROM blood_banks
      `);

      // Get blood type distribution with total units
      const [inventory] = await connection.query(`
          SELECT 
              blood_type,
              SUM(units_available) as total_units
          FROM blood_inventory
          GROUP BY blood_type
          ORDER BY blood_type
      `);

      const [lastUpdate] = await connection.query(`
        SELECT GREATEST(
            COALESCE((SELECT MAX(last_updated) FROM blood_inventory), '1970-01-01'),
            COALESCE((SELECT MAX(created_at) FROM donations), '1970-01-01')
        ) as last_updated
    `);

      // Get monthly trends from donations table
      const [monthlyTrends] = await connection.query(`
        SELECT 
            DATE_FORMAT(donation_date, '%b') as month,
            DATE_FORMAT(donation_date, '%m') as month_num,  -- Add month number for sorting
            COUNT(*) as donations
        FROM donations
        WHERE 
            status = 'Completed' 
            AND donation_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY 
            DATE_FORMAT(donation_date, '%b'),
            DATE_FORMAT(donation_date, '%m')  -- Add to GROUP BY
        ORDER BY 
            month_num  -- Order by month number
    `);

      // Get total completed donations
      const [totalDonations] = await connection.query(`
          SELECT COUNT(*) as total
          FROM donations
          WHERE status = 'Completed'
      `);

      // Get blood bank locations with their total units
      const [locations] = await connection.query(`
          SELECT 
              bb.id,
              bb.name,
              bb.area,
              bb.contact,
              bb.operating_hours,
              SUM(bi.units_available) as total_units
          FROM blood_banks bb
          LEFT JOIN blood_inventory bi ON bb.id = bi.blood_bank_id
          GROUP BY bb.id
          ORDER BY total_units DESC
      `);

      // Format blood inventory for the frontend
      const inventoryData = {};
      inventory.forEach(item => {
          inventoryData[item.blood_type] = parseInt(item.total_units);
      });

      res.json({
        success: true,
        data: {
            lastUpdated: lastUpdate[0].last_updated,
            statistics: {
                totalDonors: donors[0].total_donors,
                totalDonations: totalDonations[0].total,
                totalBloodBanks: bloodBanks[0].total_blood_banks
            },
            bloodInventory: inventoryData,
            monthlyDonations: monthlyTrends.map(item => ({
                month: item.month,
                donations: parseInt(item.donations)
            })),
            bloodBanks: locations.map(bank => ({
                ...bank,
                total_units: parseInt(bank.total_units || 0)
            }))
        }
    });

} catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
        success: false,
        message: 'Error fetching dashboard statistics',
        error: error.message
    });
} finally {
    if (connection) {
        connection.release();
    }
}
});

router.get('/donations/history', async (req, res) => {
    let connection;
    try {
      connection = await pool.getConnection();
      
      const [results] = await connection.query(
        `SELECT 
          d.id,
          d.donation_date as date,
          d.units,
          d.duration,
          d.status,
          bb.name as location
        FROM donations d
        JOIN blood_banks bb ON d.blood_bank_id = bb.id
        WHERE d.user_id = ?
        ORDER BY d.donation_date DESC`,
        [req.user.id] // Assuming you have user data in req from auth middleware
      );
  
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error fetching donation history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch donation history'
      });
    } finally {
      if (connection) connection.release();
    }
  });

module.exports = router;