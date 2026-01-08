import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./route/userRoute.js";
import providerRoute from "./route/providerRoutes.js";
import bookingRouter from "./route/bookingRoutes.js";

const app = express();

async function start() {
  try {
    // connect to database
    await connectDB();

    // middleware
    app.use(cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }));
    app.use(express.json());

    // test route
    app.get("/", (req, res) => {
      res.send("Welcome to the Service Booking Platform API");
    });

    // routes
    app.use("/api/user", userRouter);
    app.use("/api/provider", providerRoute);
    app.use("/api/bookings", bookingRouter);

    // start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Fatal startup error:", err);
    process.exit(1);
  }
}

start();
