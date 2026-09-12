import { Router } from "express";
import { admin, protect } from "../middlewares/auth.middleware.js";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from "../controllers/event.controller.js";

const router = Router();

// Get All Events
router.get("/", getAllEvents);

// Get Event by id
router.get("/:id", getEventById);

// Create Event (Admin Only)
router.post("/", protect, admin, createEvent);

// Update Event (Admin Only)
router.put("/:id", protect, admin, updateEvent);

// Delete Event (Admin Only)
router.delete("/:id", protect, admin, deleteEvent);

export default router;
