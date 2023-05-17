import { ResultSetHeader } from 'mysql2/promise';
import { Pool } from "pg";
import connection from '../../DB/database';
import express from "express";

export const newBooking = async (req: express.Request, res: express.Response) => {
  try {
    const { movie, date, seatNumber, user } = req.body;

    const query = `INSERT INTO \`movie-booking\`.\`booking\` (movieID, date, seatNumber, userID)
        SELECT ${movie}, '${date}', ${seatNumber}, ${user}
        FROM dual
        WHERE NOT EXISTS (SELECT movieID FROM \`movie-booking\`.\`booking\` WHERE movieID = ${movie} AND date = '${date}' And seatNumber = ${seatNumber} And userID = ${user});`;

    connection.query(query, (error, results: ResultSetHeader, fields) => {
      if (error) {
        return res.status(500).send({
          success: false,
          error: "This booking already exists",
        });
      }
      if (results.affectedRows > 0) {
        res.send({ success: "Your booking has been successfully added.", message: results });
      }
      else {
        res.send({ success: "Such booking already exists.", message: results });
      }

    });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
}

export const getBookingById = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  let booking;
  try {
    const [rows, fields] = await connection.execute(`SELECT * FROM \`movie-booking\`.\`booking\` WHERE bookingID=${id}`);
    booking = rows[0];
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: 'Unexpected Error' });
  }
  return res.status(200).json({ booking });
};


