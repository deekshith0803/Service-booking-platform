import express from "express";
import { protect } from "../middleware/auth.js";
import { addService, changeRollToProvider, deleteService, getProviderService, toggleServiceAvailability } from "../controller/providerController.js";
import upload from "../middleware/multer.js";

const providerRoute = express.Router();

providerRoute.post("/change-role", protect, changeRollToProvider);
providerRoute.post("/add-service", upload.single("image"), protect, addService);
providerRoute.get(".services", protect, getProviderService);
providerRoute.post(".toggle-service", protect, toggleServiceAvailability);
providerRoute.post(".delete-service", protect, deleteService);


export default providerRoute;