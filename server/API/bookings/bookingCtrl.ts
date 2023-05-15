import mysql, { ResultSetHeader } from 'mysql2/promise';
import { Pool } from "pg";
// import Bookings from '../models/Bookings';
// import Movie from '../models/Movie';
// import User from '../models/User';
import connection from '../../DB/database';
import express from "express";
const pool = new Pool();


// export const newBooking = async (req: express.Request, res: express.Response) => {
//   try {
//     const { movie, date, seatNumber, user } = req.body;
//     // const query = `INSERT INTO \`movie-booking\`.\`booking\` (movieID, date, seatNumber, userID) VALUES (${movie}, '${date}', ${seatNumber}, ${user});`;

//     const query = `INSERT INTO \`movie-booking\`.\`booking\` (movieID, date, seatNumber, userID)
// SELECT ${movie}, '${date}', ${seatNumber}, ${user}
// FROM dual
// WHERE NOT EXISTS (SELECT movieID FROM \`movie-booking\`.\`booking\` WHERE movieID = ${movie} AND date = '${date}' And seatNumber = ${seatNumber} And userID = ${user});`;

//     console.log(query);

//     connection.query(query, (error, results, fields) => {
//       if (error) {
//         console.log(error);
//         return res.status(500).send({
//           success: false,
//           error: "This booking already exists",
//         });
//       }
//       //console.log(results.affectedRows);
//       res.send({ success: "Your booking has been successfully added.", message: results });
//     });
//   } catch (error) {
//     res.status(500).send({ success: false, error });

//   }
// }

export const newBooking = async (req: express.Request, res: express.Response) => {
  try {
    const { movie, date, seatNumber, user } = req.body;
    // const query = `INSERT INTO \`movie-booking\`.\`booking\` (movieID, date, seatNumber, userID) VALUES (${movie}, '${date}', ${seatNumber}, ${user});`;

    const query = `INSERT INTO \`movie-booking\`.\`booking\` (movieID, date, seatNumber, userID)
SELECT ${movie}, '${date}', ${seatNumber}, ${user}
FROM dual
WHERE NOT EXISTS (SELECT movieID FROM \`movie-booking\`.\`booking\` WHERE movieID = ${movie} AND date = '${date}' And seatNumber = ${seatNumber} And userID = ${user});`;

    console.log(query);

    connection.query(query, (error, results: ResultSetHeader, fields) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          success: false,
          error: "This booking already exists",
        });
      }
     if(results.affectedRows >0){
      res.send({ success: "Your booking has been successfully added.", message: results });
     }
     else{
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
    const [rows, fields] = await connection.execute(`SELECT * FROM booking WHERE bookingID=${id}`);
    booking = rows[0];
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: 'Unexpected Error' });
  }
  return res.status(200).json({ booking });
};


export const deleteBooking = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;

  try {
    const bookingResult = await pool.query(
      "SELECT * FROM booking WHERE bookingID = $1",
      [id]
    );

    if (bookingResult.rowCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = bookingResult.rows[0];

    const userResult = await pool.query(
      "SELECT * FROM users WHERE userID = $1",
      [booking.user_id]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    const movieResult = await pool.query("SELECT * FROM movies WHERE movieID = $1", [booking.movieID]);

    if (movieResult.rowCount === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const movie = movieResult.rows[0];

    await pool.query("BEGIN");

    await pool.query("DELETE FROM booking WHERE bookingID = $1", [id]);

    //   await pool.query("UPDATE users SET bookings = array_remove(bookings, $1) WHERE id = $2",
    //     [id, user.id]
    //   );

    //   await pool.query(
    //     "UPDATE movies SET bookings = array_remove(bookings, $1) WHERE id = $2",
    //     [id, movie.id]
    //   );

    await pool.query("COMMIT");
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ message: "Unable to delete booking" });
  }

  return res.status(200).json({ message: "Booking deleted successfully" });
};

