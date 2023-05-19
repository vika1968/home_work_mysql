  
import express from "express";
import connection from "../../DB/database";

export const getOrdersByUserID = (req: express.Request, res: express.Response) => {
const id = req.params.id;

const query = `SELECT * FROM \`movie-booking\`.\`booking\` WHERE userID='${id}'`; 
connection.query(query, (error, results) => {
    try {
    if (error) {     
        return res.status(500).json({  success: false, error: "Internal Server Error" });
    } 

    if ((results as any[]).length === 0) {     
        return res.status(404).json({  success: false, error: "Invalid userID" });
    }

    const orders = results; 
    return res.status(200).json({ orders });

    } catch (error: any) {    
    res.status(500).send({ sucess: false, error: error.message });
    }
});
}
