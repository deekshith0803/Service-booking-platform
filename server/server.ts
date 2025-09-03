import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";

//initialize express app
const app = express()

//connect to database
await connectDB();

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the Service Booking Platform API");
});

//routes

//start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});