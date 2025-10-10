import express from "express";
import { protect } from "../middleware/auth.js";
import { addService, changeRollToProvider } from "../controller/providerController.js";
import upload from "../middleware/multer.js";

const providerRoute = express.Router();

providerRoute.post("/change-role", protect, changeRollToProvider);
providerRoute.post("/add-service", upload.single("image"), protect, addService);

export default providerRoute;