"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersByUserID = void 0;
const database_1 = __importDefault(require("../../DB/database"));
const getOrdersByUserID = (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM \`movie-booking\`.\`booking\` WHERE userID='${id}'`;
    database_1.default.query(query, (error, results) => {
        try {
            if (error) {
                return res.status(500).json({ success: false, error: "Internal Server Error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ success: false, error: "Invalid userID" });
            }
            const orders = results;
            return res.status(200).json({ orders });
        }
        catch (error) {
            res.status(500).send({ sucess: false, error: error.message });
        }
    });
};
exports.getOrdersByUserID = getOrdersByUserID;
