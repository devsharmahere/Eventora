import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

// import routes
import authRouter from "./routes/auth.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import eventRouter from "./routes/event.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/events", eventRouter);

export default app;
