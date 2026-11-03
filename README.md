# 🎟️ Eventora – Event Booking Platform

A full-stack MERN event booking platform that allows users to explore events, book tickets, and manage their bookings, while administrators can create events and manage booking requests.

## 🚀 Overview

**Eventora** is a web-based event management and booking application developed using the MERN stack. It provides separate functionalities for regular users and administrators.

Users can browse available events, view event details, and submit booking requests. Administrators can manage events, monitor bookings, and confirm booking requests through an administrative dashboard.

The application also features JWT-based authentication, role-based authorization, and a responsive interface with light and dark modes.

## ✨ Key Features

### 👤 User Features

- **User Registration & Login:** Create an account and securely log in.
- **JWT Authentication:** Authenticate users using JSON Web Tokens.
- **Browse Events:** Explore available events on the homepage.
- **Event Details:** View event descriptions, dates, locations, ticket prices, and seat availability.
- **Book Events:** Submit booking requests without an OTP verification step.
- **My Bookings:** View personal booking history and booking statuses.
- **Cancel Bookings:** Cancel existing booking requests.

### 🛠️ Admin Features

- **Admin Dashboard:** Access a centralized dashboard for managing the platform.
- **Event Management:** Create, view, and manage events.
- **Booking Management:** View all booking requests and their associated user details.
- **Booking Confirmation:** Confirm booking requests and update payment status.
- **Dashboard Statistics:** Monitor total events, bookings, revenue, paid clients, and pending requests.

### 🎨 UI & Experience

- Responsive design for different screen sizes.
- Light and dark mode toggle.
- Modern interface built with Tailwind CSS.
- Interactive navigation and dashboard components.
- Loading and error states for API operations.

## 🧰 Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- React Icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt / bcryptjs

### Development Tools

- Visual Studio Code
- Git & GitHub
- Postman
- GitHub Codespaces
- Vercel
- Render

## 🏗️ Project Structure

```text
Eventora/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── utils/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── DB/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

Follow these steps to run Eventora locally.

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/devsharmahere/Eventora.git
```

```bash
cd Eventora
```

### 2. Set Up the Backend

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d

CORS_ORIGIN=http://localhost:5173
```

**Note:** Use the exact MongoDB environment variable name expected by your database connection code. The example above assumes `MONGODB_URI`.

Start the backend:

```bash
npm start
```

The backend should run at:

```text
http://localhost:3000
```

### 3. Set Up the Frontend

Open another terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:5173
```

## 🔐 Authentication & Authorization

Eventora uses JSON Web Tokens (JWT) for authentication.

The authentication workflow:

1. Users register with their name, email, and password.
2. Passwords are securely hashed before being stored in MongoDB.
3. Users log in using their registered credentials.
4. The backend verifies credentials and generates a JWT.
5. The frontend stores the authentication token.
6. Axios automatically attaches the token to protected API requests.
7. Backend middleware validates the token and identifies the authenticated user.

**Role-based authorization:**

- `user` – Can browse events, create booking requests, view bookings, and cancel bookings.
- `admin` – Can manage events, view all bookings, and confirm booking requests.

## 🔄 Booking Workflow

The booking process follows a request-and-confirmation workflow:

1. A user selects an event.
2. The user submits a booking request.
3. The backend checks event availability and existing bookings.
4. A booking record is created with a pending status.
5. The administrator views the booking request.
6. The administrator confirms the booking and updates its payment status.
7. Available event seats are updated after confirmation.

### Booking Statuses

| Field | Possible Values |
|---|---|
| Booking Status | `pending`, `confirmed` |
| Payment Status | `paid`, `non_paid` |

## 🔌 API Overview

The backend exposes REST API endpoints under:

```text
/api
```

### Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in an existing user |

### Event Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | Retrieve events |
| GET | `/api/events/:id` | Retrieve event details |

### Booking Routes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/bookings` | Create a booking request | User |
| GET | `/api/bookings/my` | Retrieve personal bookings | User |
| DELETE | `/api/bookings/:id` | Cancel a booking | User |
| GET | `/api/bookings/all` | Retrieve all bookings | Admin |
| PUT | `/api/bookings/:id/confirm` | Confirm a booking | Admin |

**Note:** Event creation and management routes are also available for administrators. Refer to the backend route files for their exact paths and methods.

## 🔒 Security Considerations

- Password hashing before database storage.
- JWT-based authentication.
- Protected API routes.
- Role-based authorization for administrative operations.
- Environment variables for sensitive configuration.
- Backend validation of booking and authentication requests.
- CORS configuration for frontend-backend communication.

## 📸 Application Highlights

Eventora brings together event discovery, booking management, and administrative controls in one application.

Key application screens include:

- Home / Events Listing
- Event Details
- User Registration & Login
- User Dashboard
- Admin Dashboard
- Booking Management
- Light & Dark Mode

## 🚀 Deployment

The application is structured for separate frontend and backend deployment.

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

Production environment variables must be configured through the respective hosting platform dashboards.

## 📚 Learning Outcomes

Building Eventora helped me gain practical experience with:

- Full-stack application development using MERN.
- Connecting React frontend applications with Express APIs.
- REST API development and integration.
- MongoDB database modeling using Mongoose.
- Authentication and authorization using JWT.
- Managing application state using React Context API.
- Implementing CRUD operations.
- Handling asynchronous API requests using Axios.
- Building responsive interfaces with Tailwind CSS.
- Managing source code using Git and GitHub.
- Preparing full-stack applications for deployment.

## 👨‍💻 Author

**Dev Sharma**

B.Tech – Computer Science & Engineering

- GitHub: [devsharmahere](https://github.com/devsharmahere)
- LinkedIn: [devsharmahere](https://www.linkedin.com/in/devsharmahere/)

---

⭐ If you find this project interesting, consider giving it a star!
