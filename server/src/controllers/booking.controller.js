import { Booking } from "../models/booking.model.js";
import { Event } from "../models/event.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const bookEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.body;

  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (event.availableSeats <= 0) {
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
    paymentStatus: "non_paid",
    amount: event.ticketPrice,
  });

  res.status(201).json(
    new ApiResponse(201, "Booking created successfully"),
  );
});

const confirmBooking = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;

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

  if (!event || event.availableSeats <= 0) {
    throw new ApiError(400, "No seats available");
  }

  booking.status = "confirmed";
  booking.paymentStatus = paymentStatus;

  await booking.save();

  event.availableSeats -= 1;
  await event.save();

  res.status(200).json(
    new ApiResponse(200, "Booking Confirmed"),
  );
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    userId: req.user._id,
  }).populate("eventId");

  res.json(bookings);
});

const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("eventId")
    .populate("userId", "fullName email");

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
  confirmBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
};
