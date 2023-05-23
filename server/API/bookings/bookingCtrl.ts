import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import connection from '../../DB/database';
import express from "express";

export const newBooking = async (req: express.Request, res: express.Response) => {
  try {
    const { movie, date, seatNumber, user } = req.body;
    console.log(req.body)
    const query = `INSERT INTO \`movie-booking\`.\`booking\` (movieID, date, seatNumber, userID)
        SELECT ${movie}, '${date}', ${seatNumber}, ${user}
        FROM dual
        WHERE NOT EXISTS (SELECT movieID FROM \`movie-booking\`.\`booking\` WHERE movieID = ${movie} AND date = '${date}' And seatNumber = ${seatNumber} And userID = ${user});`;
    console.log(query)
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

export const newBookingBatch = async (req: express.Request, res: express.Response) => {
  try {
    const orders: { movieID: number, date: string, seatNumber: number, userID: number }[] = req.body.orders;

    // Check for existing bookings
    const existingBookingsQuery = `SELECT movieID, date, seatNumber, userID FROM \`movie-booking\`.\`booking\` WHERE `;
    const conditions = orders.map(({ movieID, date, seatNumber, userID }) =>
      `(movieID = ${movieID} AND date = '${date}' AND seatNumber = ${seatNumber} AND userID = ${userID})`
    ).join(' OR ');
    const checkExistingQuery = existingBookingsQuery + conditions;

    connection.query(checkExistingQuery, (error, results) => {
      if (error) {
        console.error('Error checking existing bookings:', error);
        res.status(500).send('Error checking existing bookings in the database.');
      } else {
        const existingBookings = results as RowDataPacket[];
        console.log('Existing Bookings:', existingBookings);

        const existingBookingsSet = new Set(existingBookings.map((booking: any) => JSON.stringify(booking)));

        // Filter out existing bookings
        const newOrders = orders.filter(order =>
          !existingBookingsSet.has(JSON.stringify(order))
        );

        if (newOrders.length === 0) {
          // All orders are duplicates
          res.send('All orders already exist in the database.');
        } else {
          // Insert new bookings
          const values = newOrders.map(({ movieID, date, seatNumber, userID }) =>
            `(${movieID}, '${date}', ${seatNumber}, ${userID})`
          ).join(',');

          const sql = `INSERT INTO \`movie-booking\`.\`booking\` (movieID, date, seatNumber, userID) VALUES ${values}`;

          connection.query(sql, (error, results) => {
            if (error) {
              console.error('Error inserting data:', error);
              res.status(500).send('Error inserting data into the database.');
            } else {
              res.send('Data successfully inserted into the database.');
            }
          });
        }
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


