import express from "express";
import {
    changeBookingStatus,
    checkAvailabilityOfService,
    createBooking,
    getProviderBooking,
    getUserBooking,
    getServiceAvailabilityForDate,
    getServiceAvailabilityRange,
    markBookingAsPaid
} from "../controller/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityOfService);
bookingRouter.get("/service-availability/:serviceId", getServiceAvailabilityForDate);
bookingRouter.get("/service-availability-range/:serviceId", getServiceAvailabilityRange);
bookingRouter.post("/create", protect, createBooking);
bookingRouter.get("/user", protect, getUserBooking);
bookingRouter.get("/provider", protect, getProviderBooking);
bookingRouter.post("/change-status", protect, changeBookingStatus);
bookingRouter.post("/mark-paid", protect, markBookingAsPaid);

export default bookingRouter;
