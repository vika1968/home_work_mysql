import express from "express";
import bcrypt from "bcrypt";
import jwt from "jwt-simple";
import { UserValidation } from "./userValidator";
import connection from "../../DB/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const saltRounds = 10;
interface User {
    userID: number;
    email: string;
    password: string;
}


export async function getUser(req: express.Request, res: express.Response) {
    try {
        const secret: any = process.env.JWT_SECRET;

        if (!secret) throw new Error("Couldn't load secret code from .env");
        const { userId } = req.cookies;

       if (!userId) throw new Error("No authorized user");//{
         
        // if (!userId) {
        //     res.status(401).send({ success: false, error: "No authorized user" });
        //     return;
        //   }
       
        const decodedUserId = jwt.decode(userId, secret);

        const query = `SELECT * FROM \`movie-booking\`.\`users\` WHERE userID = '${decodedUserId.userID}'`;

        //connection.query(query, async (error, results, fields) => {
        // or
        connection.query(query, [decodedUserId], (error, results) => {
            if (error) {
                console.error("Error executing SQL query:", error);
                res.status(500).send({ error: "Error executing SQL query" });
            } else {

                res.send({ sucess: true, userData: results });

            }
        });
    } catch (error: any) {
        res.status(500).send({ sucess: false, error: error.message });
    }
}


export async function register(req: express.Request, res: express.Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            throw new Error("Not all fields are available from req.body");

        const { error } = UserValidation.validate({ email, password });
        if (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                error: error.message,
            });
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        const query = `INSERT INTO \`movie-booking\`.\`users\` (email, password) VALUES ("${email}", "${hash}");`;
        connection.query(query, (error, results, fields) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                    success: false,
                    error: "Failed to insert user data into database",
                });
            }

            const secret = process.env.JWT_SECRET;
            if (!secret)
                return res.status(500).send({ success: false, error: "Couldn't load secret code from .env" });
            //@ts-ignore
            const cookie = { userID: results.userID };
            const JWTCookie = jwt.encode(cookie, secret);

            res.cookie("userId", JWTCookie);
            res.send({ success: true, userArray: results });
        });
    } catch (error) {
        res.status(500).send({ success: false, error });
    }
}


export async function login(req: express.Request, res: express.Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            throw new Error("no data from client login in login");
        const query = `SELECT * FROM \`movie-booking\`.\`users\` WHERE email='${email}'`;
        connection.query(query, async (err, results: RowDataPacket[], fields) => {
            try {
                if (err) throw err;
                if (!Array.isArray(results) || results.length === 0) {
                    throw new Error("Email or password doesn't match or user doesn't exists.");
                }
                const isMatch = await bcrypt.compare(password, results[0].password);

                const cookie = { userID: results[0].userID };
                const secret = process.env.JWT_SECRET;
                if (!secret) throw new Error("Couldn't load secret key from .env file");

                const JWTCookie = jwt.encode(cookie, secret);

                res.cookie("userId", JWTCookie);
                res.send({ success: true, userArray: results });
            } catch (error: any) {
                //console.log(err);
                res.status(500).send({ success: false, error: error.message });
            }
        });
    } catch (error: any) {
        res.status(500).send({ success: false, error: error.message });
    }
}

export async function updateUser(req: express.Request, res: express.Response) {
    try {
        const { email, password, id } = req.body;
        if (!email || !password || !id) {
            throw new Error('No data received from the user.');
        }
        const { error } = UserValidation.validate({ email, password });
        if (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                error: error.message,
            });
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        const query = `UPDATE \`movie-booking\`.\`users\` SET email ='${email}', password ='${hash}' WHERE userID ='${id}';`;

        connection.query(query, (error, results, fields) => {
            if (error) {
                return res.status(500).send({
                    success: false,
                    error: "Failed to update user data",
                });
            }

            const secret = process.env.JWT_SECRET;
            if (!secret)
                return res.status(500).send({ success: false, error: "Couldn't load secret code from .env" });
            //@ts-ignore
            const cookie = { userID: results.userID };
            const JWTCookie = jwt.encode(cookie, secret);

            res.cookie("userId", JWTCookie);
            res.send({ success: true, userArray: results });
        });
    } catch (error) {
        res.status(500).send({ success: false, error });
    }
}

export async function deleteUser(req: express.Request, res: express.Response) {
    try {
        const id = req.params.id;
        const query = `DELETE FROM \`movie-booking\`.\`users\` WHERE userID = ${id}`;
        connection.query(query, (err, result: ResultSetHeader) => {
            if (err) {
                console.error("Error deleting user from MySQL database: ", err);
                return res.status(500).json({ error: "Something went wrong." });
            }

            if (result.affectedRows === 0) {
                return res.status(500).json({ error: "No user found with the specified ID." });
            }

            return res.status(200).json({ success: "The user has been deleted." });

        });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}

export async function getUserByID(req: express.Request, res: express.Response) {
    try {
        const id = req.params.id;
        const query = `SELECT * FROM  \`movie-booking\`.\`users\` WHERE userID = ${id}`;

        connection.query(query, (err, result: ResultSetHeader) => {
            if (err) {
                console.error("Error getting user from MySQL database: ", err);
                return res.status(500).json({ error: "Something went wrong." });
            }
            if (result.affectedRows === 0) {
                return res.status(500).json({ error: "No user found with the specified ID." });
            }

            return res.status(200).json({ success: "The user has been dedicated.", user: result });

        });
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}

// export async function getUser(req: express.Request, res: express.Response) {
//   try {
//     const secret: any = process.env.JWT_SECRET;
//     if (!secret) throw new Error("Couldn't load secret code from .env");

//     const userId = req.cookies; // Исправлено: req.cookies.userId вместо req.cookies
//     console.log(userId);
//     if (!userId) throw new Error("No authorized user");

//     const decodedUserId = jwt.decode(userId, secret);
//     console.log('---------decodedUserId----------');
//     console.log(decodedUserId);
//     const query = `SELECT * FROM \`movie-booking\`.\`users\` WHERE userID = '${decodedUserId.userID}'`;
//     console.log(query);

//     connection.query(query, (error, results) => {
//       if (error) {
//         console.error("Error executing SQL query:", error);
//         res.status(500).send({ success: false, error: "Error executing SQL query" });
//       } else {
//         res.send({ success: true, userData: results });
//       }
//     });
//   } catch (error: any) {
//     res.status(500).send({ success: false, error: error.message });
//   }
// }


// export async function getUser(req: express.Request, res: express.Response) {
//     try {
//         console.log('userId')
//       const secret = process.env.JWT_SECRET;
//       if (!secret) throw new Error("Couldn't load secret from .env");

//       const { userID } = req.cookies;
//       console.log(userID)
//       if (!userID) throw new Error("Couldn't find user from cookies");

//       const decodedUserId = jwt.decode(userID, secret);
//       const { userId } = decodedUserId;  


//       const query = `SELECT * FROM \`movie-booking\`.\`users\` WHERE userID = 105'`;

//       connection.query(query, [decodedUserId], (error, results) => {
//         if (error) {
//             console.error("Error executing SQL query:", error);
//             res.status(500).send({ error: "Error executing SQL query" });
//         } else {
//             // console.log("User data:", results);
//             res.send({ sucess: true, userData: results });
//             // res.send({ userDB });
//         }
//     });
// } catch (error: any) {
//     res.status(500).send({ sucess: false, error: error.message });
// }
// }