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
exports.getBookingById = exports.newBookingBatch = exports.newBooking = void 0;
const database_1 = __importDefault(require("../../DB/database"));
const newBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movie, date, seatNumber, user } = req.body;
        console.log(req.body);
        const query = `INSERT INTO \`movie-booking\`.\`booking\` (movieID, date, seatNumber, userID)
        SELECT ${movie}, '${date}', ${seatNumber}, ${user}
        FROM dual
        WHERE NOT EXISTS (SELECT movieID FROM \`movie-booking\`.\`booking\` WHERE movieID = ${movie} AND date = '${date}' And seatNumber = ${seatNumber} And userID = ${user});`;
        console.log(query);
        database_1.default.query(query, (error, results, fields) => {
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
    }
    catch (error) {
        res.status(500).send({ success: false, error });
    }
});
exports.newBooking = newBooking;
const newBookingBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = req.body.orders;
        // Check for existing bookings
        const existingBookingsQuery = `SELECT movieID, date, seatNumber, userID FROM \`movie-booking\`.\`booking\` WHERE `;
        const conditions = orders.map(({ movieID, date, seatNumber, userID }) => `(movieID = ${movieID} AND date = '${date}' AND seatNumber = ${seatNumber} AND userID = ${userID})`).join(' OR ');
        const checkExistingQuery = existingBookingsQuery + conditions;
        database_1.default.query(checkExistingQuery, (error, results) => {
            if (error) {
                console.error('Error checking existing bookings:', error);
                res.status(500).send('Error checking existing bookings in the database.');
            }
            else {
                const existingBookings = results;
                console.log('Existing Bookings:', existingBookings);
                const existingBookingsSet = new Set(existingBookings.map((booking) => JSON.stringify(booking)));
                // Filter out existing bookings
                const newOrders = orders.filter(order => !existingBookingsSet.has(JSON.stringify(order)));
                if (newOrders.length === 0) {
                    // All orders are duplicates
                    res.send('All orders already exist in the database.');
                }
                else {
                    // Insert new bookings
                    const values = newOrders.map(({ movieID, date, seatNumber, userID }) => `(${movieID}, '${date}', ${seatNumber}, ${userID})`).join(',');
                    const sql = `INSERT INTO \`movie-booking\`.\`booking\` (movieID, date, seatNumber, userID) VALUES ${values}`;
                    database_1.default.query(sql, (error, results) => {
                        if (error) {
                            console.error('Error inserting data:', error);
                            res.status(500).send('Error inserting data into the database.');
                        }
                        else {
                            res.send('Data successfully inserted into the database.');
                        }
                    });
                }
            }
        });
    }
    catch (error) {
        res.status(500).send({ success: false, error });
    }
});
exports.newBookingBatch = newBookingBatch;
const getBookingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let booking;
    try {
        const [rows, fields] = yield database_1.default.execute(`SELECT * FROM \`movie-booking\`.\`booking\` WHERE bookingID=${id}`);
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
