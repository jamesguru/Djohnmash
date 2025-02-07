import express from "express";
import cors from "cors";
import { errorHandler, notFound } from "./Middleware/error.middleware.js";
import bookingRoute from "./routes/bookingRoutes.js";
import membershipRoute from "./routes/membershipRoutes.js";
import ratingRoute from "./routes/ratingRoutes.js";
import authRoute from "./routes/authRoutes.js"
import serviceRoute from "./routes/serviceRoute.js"

const app = express();

// CORS
app.use(cors());

//cors
app.use(cors());

// json body
app.use(express.json());


// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/membership", membershipRoute);
app.use("/api/v1/rating", ratingRoute)
app.use("/api/v1/service", serviceRoute)


// Error middleware
app.use(notFound);
app.use(errorHandler);


export default app;