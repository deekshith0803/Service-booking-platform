import { Request, Response } from "express";
import User from "../model/User.js";
import Service from "../model/Service.js";
import Booking from "../model/Booking.js";
import Review from "../model/Review.js";

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalServices = await Service.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalReviews = await Review.countDocuments();

        // Average Rating
        const avgRatingResult = await Review.aggregate([
            { $group: { _id: null, avg: { $avg: "$rating" } } }
        ]);
        const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avg.toFixed(1) : 0;

        // Booking Status Summary
        const statusSummary = await Booking.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Bookings by Category
        const categorySummary = await Booking.aggregate([
            {
                $lookup: {
                    from: "services",
                    localField: "service",
                    foreignField: "_id",
                    as: "serviceDetails"
                }
            },
            { $unwind: "$serviceDetails" },
            {
                $group: {
                    _id: "$serviceDetails.category",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Daily Booking Count (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyBookings = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Recent Bookings
        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email")
            .populate("service", "title");

        // Recent Cancellations
        const recentCancellations = await Booking.find({ status: "cancelled" })
            .sort({ updatedAt: -1 })
            .limit(5)
            .populate("user", "name email")
            .populate("service", "title");

        // Recent Reviews
        const recentReviews = await Review.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("userId", "name email")
            .populate("serviceId", "title");

        res.status(200).json({
            success: true,
            data: {
                counts: {
                    users: totalUsers,
                    services: totalServices,
                    bookings: totalBookings,
                    reviews: totalReviews,
                    avgRating: parseFloat(avgRating),
                },
                statusSummary,
                categorySummary,
                dailyBookings,
                alerts: {
                    recentBookings,
                    recentCancellations,
                    recentReviews
                }
            },
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all providers
export const getAllProviders = async (req: Request, res: Response) => {
    try {
        const providers = await User.find({
            $or: [{ role: "provider" }, { isProviderRequested: true }]
        }).select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, providers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all bookings
export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("service", "title category")
            .populate("provider", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update user role or approval
export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { userId, role, isApproved } = req.body;

        const updateData: any = {};
        if (role) updateData.role = role;
        if (typeof isApproved === 'boolean') {
            updateData.isApproved = isApproved;
            if (isApproved) {
                updateData.role = "provider";
                updateData.isProviderRequested = false;
            }
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
