const oracledb = require('oracledb');
const db = require('../db'); // ไฟล์ db.js ของคุณ

exports.loginTenant = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
  }

  let connection;
  try {
    connection = await db.getConnection();

    // ใช้ AccUser และ AccPass
    const result = await connection.execute(
      `SELECT AccID, RoomID, AccUser
       FROM Account
       WHERE AccUser = :username AND AccPass = :password`,
      { username, password },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      username: user.ACCUSER,
      roomId: user.ROOMID,
      accId: user.ACCID
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในระบบ' });
  } finally {
    if (connection) await connection.close();
  }
};