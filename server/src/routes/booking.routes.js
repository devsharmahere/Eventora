import { Router } from "express";
import { admin, protect } from "../middlewares/auth.middleware.js";
import {
  bookEvent,
  cancelBooking,
  confirmBooking,
  getMyBookings,
  sendBookingOTP,
} from "../controllers/booking.controller.js";

const router = Router();

router.post("/", protect, bookEvent);
router.post("/send-otp", protect, sendBookingOTP);
router.get("/my", protect, getMyBookings);
router.put("/:id/confirm", protect, admin, confirmBooking);
router.delete("/:id", protect, cancelBooking);

export default router;
