import express from "express";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminAuth.js";
import {
    getAdminStats,
    getAllUsers,
    getAllProviders,
    getAllBookings,
    updateUserRole,
    updateUserPassword
} from "../controller/adminController.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/providers", protect, adminOnly, getAllProviders);
router.get("/bookings", protect, adminOnly, getAllBookings);
router.post("/update-role", protect, adminOnly, updateUserRole);
router.post("/update-password", protect, adminOnly, updateUserPassword);
export default router;
