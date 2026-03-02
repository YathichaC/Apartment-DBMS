const oracledb = require('oracledb');
const db = require('../db');

exports.getBillsByRoom = async (req, res) => {
  const { roomId } = req.params;

  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT BillID, Month, Year, RoomRent, ElectricityCost, WaterCost, OtherCharges, TotalAmount, DueDate, Status
       FROM Bill
       WHERE RoomID = :roomId
       ORDER BY Year DESC, Month DESC`,
      { roomId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({
      success: true,
      bills: result.rows
    });

  } catch (err) {
    console.error('Get bills error:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบิล' });
  } finally {
    if (connection) await connection.close();
  }
};