import { Event } from "../models/event.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getAllEvents = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.category) {
    filters.category = req.query.category;
  }
  if (req.query.location) {
    filters.location = req.query.location;
  }
  if (req.query.ticketPrice) {
    filters.ticketPrice = req.query.ticketPrice;
  }

  const events = await Event.find(filters);

  res.json(events);
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Event fetched successfully", event));
});

const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    date,
    location,
    category,
    totalSeats,
    ticketPrice,
    imageUrl,
  } = req.body;

  const event = await Event.create({
    title,
    description,
    date,
    location,
    category,
    totalSeats,
    ticketPrice,
    imageUrl,
    availableSeats: totalSeats,
    createdBy: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Event created successfully", event));
});

const updateEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    date,
    location,
    category,
    totalSeats,
    ticketPrice,
    imageUrl,
  } = req.body;

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      ticketPrice,
      imageUrl,
    },
    { new: true },
  );
  if (!event) {
    throw new ApiError(404, "Event not found");
  }
  res.status(200).json(new ApiResponse(200, "Event Updated", event));
});

const deleteEvent = asyncHandler(async(req,res)=>{
    const event = await Event.findByIdAndDelete(req.params.id)
    if(!event){
        throw new ApiError(404, "Event not found")
    }
    res.status(200).json(new ApiResponse(200, "Event Deleted"))
})

export { getAllEvents, getEventById, createEvent, updateEvent,deleteEvent };
