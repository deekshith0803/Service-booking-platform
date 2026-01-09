import express from "express";
import { protect } from "../middleware/auth.js";
import Conversation from "../model/Conversation.js";
import Message from "../model/Message.js";
import User from "../model/User.js";

const router = express.Router();

// @route   POST /api/chat/start
// @desc    Start or get existing conversation
// @access  Private
router.post("/start", protect, async (req, res) => {
    try {
        const { serviceId, providerId } = req.body;
        const userId = req.user?._id;

        if (!userId || !providerId || !serviceId) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }

        // Check if conversation exists
        let conversation = await Conversation.findOne({
            userId,
            providerId,
            serviceId,
        });

        if (!conversation) {
            conversation = await Conversation.create({
                userId,
                providerId,
                serviceId,
            });
        }

        res.status(200).json({ success: true, conversation });
    } catch (error) {
        console.error("Start chat error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// @route   GET /api/chat/provider/conversations
// @desc    Get all conversations for provider
// @access  Private (Provider only)
router.get("/provider/conversations", protect, async (req, res) => {
    try {
        // Ensure user is provider
        if (req.user?.role !== 'provider') {
            res.status(403).json({ success: false, message: "Access denied" });
            return;
        }

        const conversations = await Conversation.find({ providerId: req.user?._id })
            .populate("userId", "name image")
            .populate("serviceId", "title")
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, conversations });
    } catch (error) {
        console.error("Get conversations error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// @route   GET /api/chat/:conversationId
// @desc    Get messages for a conversation
// @access  Private
router.get("/:conversationId", protect, async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        }).sort({ createdAt: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;
