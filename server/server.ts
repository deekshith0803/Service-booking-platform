import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./route/userRoute.js";
import providerRoute from "./route/providerRoutes.js";


// initialize express app
const app = express();

// connect to database
await connectDB();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
    res.send("Welcome to the Service Booking Platform API");
});

// routes
app.use("/api/user", userRouter);
app.use("/api/provider", providerRoute)

// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
