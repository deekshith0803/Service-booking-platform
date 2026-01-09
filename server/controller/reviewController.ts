import { Request, Response } from "express";
import Review from "../model/Review.js";
import User from "../model/User.js";

interface AuthRequest extends Request {
    user?: any; // or correct User interface
}

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { serviceId, rating, comment } = req.body;
        const userId = req.user.id;

        if (!serviceId || !rating || !comment) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }

        // Optional: Check if user already reviewed this service
        // const existingReview = await Review.findOne({ serviceId, userId });
        // if (existingReview) { 
        //    res.status(400).json({ success: false, message: "You have already reviewed this service" }); 
        //    return; 
        // }

        const newReview = new Review({
            serviceId,
            userId,
            rating,
            comment,
        });

        await newReview.save();

        res.status(201).json({ success: true, message: "Review added successfully", review: newReview });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { serviceId } = req.params;

        const reviews = await Review.find({ serviceId })
            .populate("userId", "name image") // Populate user name and image
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
