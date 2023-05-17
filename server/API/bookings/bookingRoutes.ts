import express from "express";
import {
  getBookingById,
  newBooking,
} from "./bookingCtrl";

const bookingsRouter = express.Router();

bookingsRouter.get("/:id", getBookingById);
bookingsRouter.post("/", newBooking);

export default bookingsRouter;
