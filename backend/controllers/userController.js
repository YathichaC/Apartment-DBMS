const oracledb = require('oracledb');
const db = require('../db');

exports.createUser = async (req, res) => {
  const { roomId, accUser, accPass } = req.body;

  if (!roomId || !accUser || !accPass) {
    return res.status(400).json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' });
  }

  let connection;
  try {
    connection = await db.getConnection();

    // ตรวจว่าห้องนี้มีผู้ใช้แล้วหรือยัง
    const check = await connection.execute(
      `SELECT COUNT(*) AS CNT FROM Account WHERE RoomID = :roomId`,
      { roomId }
    );

    if (check.rows[0].CNT > 0) {
      return res.status(400).json({ success: false, message: `ห้อง ${roomId} มีผู้ใช้อยู่แล้ว` });
    }

    // ตรวจว่า AccUser ซ้ำหรือไม่
    const userCheck = await connection.execute(
      `SELECT COUNT(*) AS CNT FROM Account WHERE AccUser = :accUser`,
      { accUser }
    );

    if (userCheck.rows[0].CNT > 0) {
      return res.status(400).json({ success: false, message: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' });
    }

    // เพิ่มผู้ใช้ใหม่ (ใช้ sequence สำหรับ AccID)
    await connection.execute(
      `INSERT INTO Account (AccID, AccUser, AccPass, RoomID)
       VALUES (Account_SEQ.NEXTVAL, :accUser, :accPass, :roomId)`,
      { accUser, accPass, roomId }
    );

    await connection.commit();

    res.json({ success: true, message: 'เพิ่มผู้ใช้สำเร็จ' });

  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด: ' + err.message });
  } finally {
    if (connection) await connection.close();
  }
};

exports.getAllUsers = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT AccID, AccUser, AccPass, RoomID 
       FROM Account 
       ORDER BY RoomID ASC`,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({
      success: true,
      users: result.rows
    });

  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงรายการผู้ใช้ได้' });
  } finally {
    if (connection) await connection.close();
  }
};
exports.deleteUser = async (req, res) => {

  const id = req.params.id;

  let connection;

  try {

    connection = await db.getConnection();

    const result = await connection.execute(
      `DELETE FROM Account WHERE AccID = :id`,
      { id }
    );

    await connection.commit();

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้'
      });
    }

    res.json({
      success: true,
      message: 'ลบผู้ใช้สำเร็จ'
    });

  } catch (err) {

    console.error('Delete user error:', err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  } finally {

    if (connection) await connection.close();

  }

};