import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addService,
  changeRollToProvider,
  deleteService,
  getDashboardData,
  getProviderService,
  toggleServiceAvailability,
  updateUserImage,
  updateService,
} from "../controller/providerController.js";
import upload from "../middleware/multer.js";

const providerRoute = express.Router();

providerRoute.post("/change-role", protect, changeRollToProvider as unknown as express.RequestHandler);
providerRoute.post(
  "/add-service",
  protect,
  upload.single("image"),
  addService as unknown as express.RequestHandler
);

providerRoute.get("/services", protect, getProviderService as unknown as express.RequestHandler);
providerRoute.post("/toggle-service", protect, toggleServiceAvailability as unknown as express.RequestHandler);
providerRoute.post("/update-service/:serviceId", protect, upload.single("image"), updateService as unknown as express.RequestHandler);
providerRoute.post("/delete-service", protect, deleteService as unknown as express.RequestHandler);
providerRoute.get("/dashboard", protect, getDashboardData as unknown as express.RequestHandler);


export default providerRoute;