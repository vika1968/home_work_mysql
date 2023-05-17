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
exports.getBookingById = exports.newBooking = void 0;
const database_1 = __importDefault(require("../../DB/database"));
const newBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movie, date, seatNumber, user } = req.body;
        const query = `INSERT INTO \`movie-booking\`.\`booking\` (movieID, date, seatNumber, userID)
        SELECT ${movie}, '${date}', ${seatNumber}, ${user}
        FROM dual
        WHERE NOT EXISTS (SELECT movieID FROM \`movie-booking\`.\`booking\` WHERE movieID = ${movie} AND date = '${date}' And seatNumber = ${seatNumber} And userID = ${user});`;
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
