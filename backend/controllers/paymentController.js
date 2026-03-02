const db = require("../db");
const oracledb = require("oracledb");

exports.getAllPayments = async (req, res) => {

  let conn;

  try {

    conn = await db.getConnection();

    const result = await conn.execute(
      `
      SELECT
        PayID,
        RoomID,
        PayAmount,
        PayDate,
        PayFiles
      FROM Payment
      ORDER BY PayDate DESC
      `,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  } finally {

    if (conn) await conn.close();

  }

};

exports.getSlip = async (req, res) => {

  let conn;

  try {

    const bookingId = req.params.bookingId;

    conn = await db.getConnection();

    const result = await conn.execute(
      `SELECT PayFiles
       FROM Payment
       WHERE BookingID = :bookingId`,
      { bookingId }
    );

    if (result.rows.length === 0) {
      return res.status(404).send("ไม่พบสลิป");
    }

    const blob = result.rows[0].PAYFILES;

    res.setHeader("Content-Type", "image/jpeg");
    res.send(blob);

  } catch (err) {

    console.error(err);
    res.status(500).send(err.message);

  } finally {

    if (conn)
      await conn.close();

  }

};