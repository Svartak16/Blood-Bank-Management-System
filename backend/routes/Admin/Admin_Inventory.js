const express = require('express');
const router = express.Router();
const pool = require('../../config/database');
const authMiddleware = require('../../middleware/auth');
const checkPermission = require('../../middleware/checkPermission');

// Update inventory
router.put('/inventory/update', authMiddleware, checkPermission('can_manage_inventory'), async (req, res) => {
  let connection;
  try {
    const { bankId, bloodType, operation, units } = req.body;
    
    if (!bankId || !bloodType || !operation || !units) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    connection = await pool.getConnection();
    
    // Get current inventory
    const [currentInventory] = await connection.query(
      'SELECT units_available FROM blood_inventory WHERE blood_bank_id = ? AND blood_type = ?',
      [bankId, bloodType]
    );

    if (currentInventory.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory record not found'
      });
    }

    // Calculate new units
    let newUnits = operation === 'add' 
      ? currentInventory[0].units_available + units
      : currentInventory[0].units_available - units;

    // Prevent negative inventory
    if (newUnits < 0) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient units available'
      });
    }

    // Update inventory
    await connection.query(
      `UPDATE blood_inventory 
       SET units_available = ?, last_updated = CURRENT_TIMESTAMP 
       WHERE blood_bank_id = ? AND blood_type = ?`,
      [newUnits, bankId, bloodType]
    );

    res.json({
      success: true,
      message: 'Inventory updated successfully'
    });

  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inventory'
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;