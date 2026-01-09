import express from "express";
import { addReview, getReviews } from "../controller/reviewController.js";
import { protect } from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", protect, addReview);
reviewRouter.get("/:serviceId", getReviews);

export default reviewRouter;
