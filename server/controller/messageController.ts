import { Request, Response } from "express";
import Message from "../model/Message.js"; // Note: .js extension for compiled output compatibility if using generic ts config
import mongoose from "mongoose";

// Send a message
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderId, receiverId, message, text, bookingId } = req.body;
        const msgContent = text || message;

        if (!senderId || !receiverId || !msgContent) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text: msgContent,
            bookingId,
            // timestamp is auto-set
        });

        await newMessage.save();

        res.status(201).json({ success: true, message: "Message sent", data: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get chat history between two users (or just for the current user)
// If bookingId is provided, filter by that too.
export const getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params; // The "other" user ID
        const currentUserId = req.query.currentUserId as string; // passed as query for simplicity or from auth middleware

        if (!currentUserId || !userId) {
            res.status(400).json({ success: false, message: "User IDs required" });
            return;
        }

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ]
        }).sort({ timestamp: 1 }).populate('senderId', 'name email role');

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// Get unread counts for a user (grouped by sender)
export const getUnreadCounts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params; // The user checking their unread messages

        // Aggregate to count unread messages where receiverId is the current user
        const unreadCounts = await Message.aggregate([
            { $match: { receiverId: new mongoose.Types.ObjectId(userId), isRead: false } },
            { $group: { _id: { $toString: "$senderId" }, count: { $sum: 1 } } }
        ]);

        // Transform into a cleaner object: { senderId: count, ... }
        const countsMap: Record<string, number> = {};
        unreadCounts.forEach((item: any) => {
            countsMap[item._id] = item.count;
        });

        res.status(200).json({ success: true, counts: countsMap });
    } catch (error) {
        console.error("Error fetching unread counts:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Mark messages as read from a specific sender
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderId, receiverId } = req.body;

        await Message.updateMany(
            {
                senderId: new mongoose.Types.ObjectId(senderId),
                receiverId: new mongoose.Types.ObjectId(receiverId),
                isRead: false
            },
            { $set: { isRead: true } }
        );

        res.status(200).json({ success: true, message: "Messages marked as read" });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
// Get all conversations for a user (distinct users they have chatted with)
export const getConversations = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        // Find all messages where current user is sender or receiver
        const params: any = {
            $or: [{ senderId: userId }, { receiverId: userId }]
        };

        // Get unique interaction user IDs
        const messages = await Message.find(params).sort({ timestamp: -1 });
        const userIds = new Set<string>();
        const conversations: any[] = [];

        for (const msg of messages) {
            const otherId = msg.senderId.toString() === userId.toString() ? msg.receiverId : msg.senderId;
            if (otherId && !userIds.has(otherId.toString())) {
                userIds.add(otherId.toString());

                // Fetch other user details (optimize this with aggregation later if needed)
                // Note: We need a User model import if not present, assuming we can populate or fetch.
                // Since this file imports Message, we might need dynamic import or rely on populate if we change schema.
                // For now, let's just return the ID and last message. Front-end might need to fetch user details or we Populate here.
                // Better approach: Populate sender/receiver in the find query if Schema supports refs.
                // Message Schema stores Strings for IDs usually. We might need to manually fetch.

                conversations.push({
                    _id: otherId, // Using user ID as conversation ID for simplicity in this context
                    lastMessage: msg.text,
                    timestamp: msg.timestamp,
                    otherUserId: otherId
                });
            }
        }

        // Populate user details manually since we have IDs
        // We need User model.
        const User = (await import("../model/User.js")).default;
        const Service = (await import("../model/Service.js")).default; // If we want to link service info

        const populatedConversations = await Promise.all(conversations.map(async (conv) => {
            const user = await User.findById(conv.otherUserId).select("name image email");
            return {
                ...conv,
                userId: user, // Map to expected frontend format
                updatedAt: conv.timestamp
            };
        }));

        res.json({ success: true, conversations: populatedConversations });

    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
