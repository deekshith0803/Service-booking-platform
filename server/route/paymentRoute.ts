import express from "express";
import { createOrder, verifyPayment } from "../controller/paymentController.js";
import { protect } from "../middleware/auth.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", protect, createOrder);
paymentRouter.post("/verify-payment", protect, verifyPayment);

export default paymentRouter;
