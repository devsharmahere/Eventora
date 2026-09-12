import mongoose from "mongoose";
import dotenv from "dotenv";

import { User } from "./models/user.model.js";
import { Event } from "./models/event.model.js";
import { Booking } from "./models/booking.model.js";

dotenv.config({
  path: "./.env",
});

const users = [
  {
    fullName: "Admin User",
    email: "admin@eventora.com",
    password: "password123",
    role: "admin",
    isVerified: true,
  },
  {
    fullName: "Demo User",
    email: "user@eventora.com",
    password: "password123",
    role: "user",
    isVerified: true,
  },
  {
    fullName: "Alice Smith",
    email: "alice@eventora.com",
    password: "password123",
    role: "user",
    isVerified: true,
  },
  {
    fullName: "Bob Johnson",
    email: "bob@eventora.com",
    password: "password123",
    role: "user",
    isVerified: true,
  },
  {
    fullName: "Charlie Davis",
    email: "charlie@eventora.com",
    password: "password123",
    role: "user",
    isVerified: true,
  },
];

const events = [
  {
    title: "React & Node.js Developer Workshop",
    description:
      "A deep dive into modern full-stack web development using React and Node.js.",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    location: "Delhi",
    category: "Technology",
    totalSeats: 100,
    availableSeats: 100,
    ticketPrice: 500,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Neon Nights Music Festival",
    description:
      "Experience an unforgettable night of music, performances and entertainment.",
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    location: "Mumbai",
    category: "Music",
    totalSeats: 200,
    availableSeats: 200,
    ticketPrice: 1500,
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Global Business Summit",
    description:
      "A gathering of entrepreneurs, founders and investors discussing the future of business.",
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    location: "Bangalore",
    category: "Business",
    totalSeats: 150,
    availableSeats: 150,
    ticketPrice: 5000,
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Modern Art Expo",
    description:
      "Explore contemporary artwork from emerging and established artists.",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    location: "Mumbai",
    category: "Art",
    totalSeats: 120,
    availableSeats: 120,
    ticketPrice: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Startup Pitch Competition",
    description:
      "Watch startups pitch their ideas and connect with entrepreneurs and investors.",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    location: "Hyderabad",
    category: "Business",
    totalSeats: 250,
    availableSeats: 250,
    ticketPrice: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Cloud Computing Seminar",
    description:
      "Learn about scalable cloud architecture, serverless computing and modern infrastructure.",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    location: "Pune",
    category: "Technology",
    totalSeats: 100,
    availableSeats: 100,
    ticketPrice: 600,
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("✅ MongoDB connected");

    // Clear existing data
    await Booking.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});

    console.log("🗑️ Existing data cleared");

    // Create users
    // User.create() triggers your pre("save") middleware,
    // so passwords will automatically be hashed.
    const createdUsers = [];

    for (const user of users) {
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
    }

    console.log(`👤 Created ${createdUsers.length} users`);

    // Find admin
    const adminUser = createdUsers.find((user) => user.role === "admin");

    // Add admin as event creator
    const eventsWithAdmin = events.map((event) => ({
      ...event,
      createdBy: adminUser._id,
    }));

    // Create events
    const createdEvents = await Event.insertMany(eventsWithAdmin);

    console.log(`🎉 Created ${createdEvents.length} events`);

    // Get normal users
    const normalUsers = createdUsers.filter((user) => user.role === "user");

    // Create bookings
    const bookings = [
      {
        userId: normalUsers[0]._id,
        eventId: createdEvents[0]._id,
        status: "confirmed",
        paymentStatus: "paid",
        amount: createdEvents[0].ticketPrice,
      },
      {
        userId: normalUsers[1]._id,
        eventId: createdEvents[0]._id,
        status: "confirmed",
        paymentStatus: "paid",
        amount: createdEvents[0].ticketPrice,
      },
      {
        userId: normalUsers[2]._id,
        eventId: createdEvents[1]._id,
        status: "confirmed",
        paymentStatus: "paid",
        amount: createdEvents[1].ticketPrice,
      },
      {
        userId: normalUsers[3]._id,
        eventId: createdEvents[1]._id,
        status: "pending",
        paymentStatus: "non_paid",
        amount: createdEvents[1].ticketPrice,
      },
      {
        userId: normalUsers[0]._id,
        eventId: createdEvents[2]._id,
        status: "confirmed",
        paymentStatus: "paid",
        amount: createdEvents[2].ticketPrice,
      },
      {
        userId: normalUsers[1]._id,
        eventId: createdEvents[3]._id,
        status: "pending",
        paymentStatus: "non_paid",
        amount: createdEvents[3].ticketPrice,
      },
    ];

    await Booking.insertMany(bookings);

    console.log(`🎫 Created ${bookings.length} bookings`);

    // Update available seats based on confirmed bookings
    for (const event of createdEvents) {
      const confirmedBookings = bookings.filter(
        (booking) =>
          booking.eventId.toString() === event._id.toString() &&
          booking.status === "confirmed",
      ).length;

      event.availableSeats = event.totalSeats - confirmedBookings;

      await event.save();
    }

    console.log("💺 Available seats updated");

    console.log("\n🚀 Database seeded successfully!");
    console.log("-----------------------------------");
    console.log("Admin Email: admin@eventora.com");
    console.log("User Email:  user@eventora.com");
    console.log("Password:    password123");
    console.log("-----------------------------------\n");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedDatabase();
