import express from "express";
import {
    changeBookingStatus,
    checkAvailabilityOfService,
    createBooling,
    getProviderBooking,
    getUserBooking,
    getServiceAvailabilityForDate
} from "../controller/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityOfService);
bookingRouter.get("/service-availability/:serviceId", getServiceAvailabilityForDate);
bookingRouter.post("/create", protect, createBooling);
bookingRouter.get("/user", protect, getUserBooking);
bookingRouter.get("/provider", protect, getProviderBooking);
bookingRouter.post("/change-status", protect, changeBookingStatus);

export default bookingRouter;
