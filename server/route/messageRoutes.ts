import express from "express";
import { sendMessage, getMessages, getUnreadCounts, markAsRead, getConversations } from "../controller/messageController.js";
import { protect } from "../middleware/auth.js"; // Assuming auth middleware exists

const messageRouter = express.Router();

messageRouter.post("/send", protect, sendMessage);
messageRouter.get("/conversations", protect, getConversations);
messageRouter.get("/unread/:userId", protect, getUnreadCounts); // get all unread counts for the logged in user
messageRouter.get("/:userId", protect, getMessages); // get messages with a specific user
messageRouter.put("/read", protect, markAsRead);

export default messageRouter;
