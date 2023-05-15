"use strict";
// // import mysql from "mysql"; 
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { createConnection } from "mysql2";
// // require("dotenv").config(); 
// // const sqlPassword = process.env.SQLPASSWORD;
// // const connection = mysql.createConnection({
// //   host: "localhost",
// //   port: 3306,
// //   user: "max",
// //   password: sqlPassword,
// //   database: "blockbusters",
// //   multipleStatements: true
// //   });
// //   connection.connect((err) => { //promise
// //     try {
// //       if (err) throw err;
// //       console.info("🔥 MySQL is connected 🛢 ");
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   });
// //   export default connection;
// require("dotenv").config(); 
// const sqlPassword = process.env.SQLPASSWORD;
// const connection = await createConnection({
//   host: "localhost",
//   port: 3306,
//   user: "max",
//   password: sqlPassword,
//   database: "blockbusters",
// });
// try {
//   await connection.connect();
//   console.info("🔥 MySQL is connected 🛢 ");
// } catch (error) {
//   console.error(error);
// }
// export default connection;
const mysql2_1 = __importDefault(require("mysql2"));
require("dotenv").config();
const sqlPassword = process.env.SQLPASSWORD;
//@ts-ignore
const connection = mysql2_1.default.createConnection({
    host: "localhost",
    port: 3306,
    user: "max",
    password: sqlPassword,
    database: "movie-booking",
    // multipleStatements: true -- multiple querys with each connect
});
console.log(connection.authorized);
connection.connect((err) => {
    try {
        if (err)
            throw err;
        console.info("🔥 MySQL is connected 🛢 ");
    }
    catch (error) {
        console.error(error);
    }
});
exports.default = connection;
