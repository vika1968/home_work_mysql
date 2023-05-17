
import express from "express";
import { login, register, getUser, updateUser, deleteUser, getUserByID} from "./usersCtrl";

const userRouter = express.Router();

userRouter
  .get("/:id", getUserByID)
  .post("/login", login)
  .post("/register", register)
  .put("/update-user", updateUser)
  .delete("/:id", deleteUser)
  .get("/reducer/get-user-by-cookie", getUser)  
export default userRouter;



