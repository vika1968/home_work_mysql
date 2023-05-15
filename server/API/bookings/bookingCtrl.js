"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.getBookingById = exports.newBooking = void 0;
const pg_1 = require("pg");
// import Bookings from '../models/Bookings';
// import Movie from '../models/Movie';
// import User from '../models/User';
const database_1 = __importDefault(require("../../DB/database"));
const pool = new pg_1.Pool();
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
const newBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movie, date, seatNumber, user } = req.body;
        // const query = `INSERT INTO \`movie-booking\`.\`booking\` (movieID, date, seatNumber, userID) VALUES (${movie}, '${date}', ${seatNumber}, ${user});`;
        const query = `INSERT INTO \`movie-booking\`.\`booking\` (movieID, date, seatNumber, userID)
SELECT ${movie}, '${date}', ${seatNumber}, ${user}
FROM dual
WHERE NOT EXISTS (SELECT movieID FROM \`movie-booking\`.\`booking\` WHERE movieID = ${movie} AND date = '${date}' And seatNumber = ${seatNumber} And userID = ${user});`;
        console.log(query);
        database_1.default.query(query, (error, results, fields) => {
            if (error) {
                console.log(error);
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
    }
    catch (error) {
        res.status(500).send({ success: false, error });
    }
});
exports.newBooking = newBooking;
const getBookingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let booking;
    try {
        const [rows, fields] = yield database_1.default.execute(`SELECT * FROM booking WHERE bookingID=${id}`);
        booking = rows[0];
    }
    catch (err) {
        return console.log(err);
    }
    if (!booking) {
        return res.status(500).json({ message: 'Unexpected Error' });
    }
    return res.status(200).json({ booking });
});
exports.getBookingById = getBookingById;
const deleteBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const bookingResult = yield pool.query("SELECT * FROM booking WHERE bookingID = $1", [id]);
        if (bookingResult.rowCount === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }
        const booking = bookingResult.rows[0];
        const userResult = yield pool.query("SELECT * FROM users WHERE userID = $1", [booking.user_id]);
        if (userResult.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = userResult.rows[0];
        const movieResult = yield pool.query("SELECT * FROM movies WHERE movieID = $1", [booking.movieID]);
        if (movieResult.rowCount === 0) {
            return res.status(404).json({ message: "Movie not found" });
        }
        const movie = movieResult.rows[0];
        yield pool.query("BEGIN");
        yield pool.query("DELETE FROM booking WHERE bookingID = $1", [id]);
        //   await pool.query("UPDATE users SET bookings = array_remove(bookings, $1) WHERE id = $2",
        //     [id, user.id]
        //   );
        //   await pool.query(
        //     "UPDATE movies SET bookings = array_remove(bookings, $1) WHERE id = $2",
        //     [id, movie.id]
        //   );
        yield pool.query("COMMIT");
    }
    catch (err) {
        yield pool.query("ROLLBACK");
        console.error(err);
        return res.status(500).json({ message: "Unable to delete booking" });
    }
    return res.status(200).json({ message: "Booking deleted successfully" });
});
exports.deleteBooking = deleteBooking;
