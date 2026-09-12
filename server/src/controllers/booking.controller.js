import { Booking } from "../models/booking.model.js";
import { OTP } from "../models/otp.model.js";
import { Event } from "../models/event.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sendOTPEmail, sendBookingEmail } from "../utils/email.js";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendBookingOTP = asyncHandler(async (req, res) => {
  const otp = generateOtp();

  await OTP.findOneAndDelete({
    email: req.user.email,
    action: "event_booking",
  });
  await OTP.create({
    email: req.user.email,
    otp: otp,
    action: "event_booking",
  });
  await sendOTPEmail(req.user.email, otp, "event_booking");
  res.json({ message: "OTP sent to email" });
});

const bookEvent = asyncHandler(async (req, res) => {
  const { eventId, otp } = req.body;
  const otpRecord = await OTP.findOne({
    email: req.user.email,
    otp,
    action: "event_booking",
  });
  if (!otpRecord) {
    throw new ApiError(400, "Invalid or expired OTP");
  }
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (event.totalSeats <= 0) {
    throw new ApiError(400, "No seats available");
  }
  const existingBooking = await Booking.findOne({
    userId: req.user._id,
    eventId,
  });
  if (existingBooking) {
    throw new ApiError(400, "You have already booked this event");
  }

  await Booking.create({
    userId: req.user._id,
    eventId,
    status: "pending",
    paymentStatus: "non-paid",
    amount: event.ticketPrice,
  });

  await OTP.deleteMany({ email: req.user.email, action: "event_booking" });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Booking created. Please check your email for confirmation ",
      ),
    );
});

const confirmBooking = asyncHandler(async (req, res) => {
  const paymentStatus = req.body.paymentStatus;
  if (!["paid", "non_paid"].includes(paymentStatus)) {
    throw new ApiError(400, "Invalid payment status");
  }
  const booking = await Booking.findById(req.params.id).populate("eventId");
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  if (booking.status === "confirmed") {
    throw new ApiError(400, "Booking is already confirmed");
  }
  const event = booking.eventId;
  if (event.totalSeats <= 0) {
    throw new ApiError(400, "No seats available");
  }
  booking.status = "confirmed";
  booking.paymentStatus = paymentStatus;
  await booking.save();
  event.availableSeats -= 1;
  await event.save();

  // admin confirms booking , send email to user
  await sendBookingEmail(req.user.email, booking._id, event.title);
  res.status(200).json(new ApiResponse(200, "Booking Confirmed"));
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).populate(
    "eventId",
  );
  res.json(bookings);
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("eventId");
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  if (booking.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  if (booking.status === "confirmed") {
    const event = booking.eventId;
    event.availableSeats += 1;
    await event.save();
  }
  await booking.deleteOne();
  res.json({ message: "Booking cancelled" });
});

export {
  bookEvent,
  sendBookingOTP,
  confirmBooking,
  getMyBookings,
  cancelBooking,
};
