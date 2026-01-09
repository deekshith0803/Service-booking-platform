import express from "express";
import "dotenv/config";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRouter from "./route/userRoute.js";
import providerRoute from "./route/providerRoutes.js";
import bookingRouter from "./route/bookingRoutes.js";
import messageRouter from "./route/messageRoutes.js";
import chatRouter from "./route/chatRoute.js";
import { socketAuthMiddleware } from "./middleware/socketAuth.js";
import Message from "./model/Message.js";
import Conversation from "./model/Conversation.js";
import adminRouter from "./route/adminRoutes.js";
import reviewRouter from "./route/reviewRoute.js";

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Socket.io middleware
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user?.name} (${socket.id})`);

  // Join conversation room
  socket.on("join_room", (room: string) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // Send message
  socket.on("send_message", async (data: any) => {
    try {
      // Save message to DB
      const newMessage = await Message.create({
        conversationId: data.room, // Room ID is now Conversation ID
        senderId: socket.user._id,
        text: data.content,
      });

      // Update last message in Conversation
      await Conversation.findByIdAndUpdate(data.room, {
        lastMessage: data.content,
        updatedAt: new Date(),
      });

      // Emit back full message object including ID to ALL users in room (including sender)
      io.to(data.room).emit("receive_message", {
        ...data,
        _id: newMessage._id,
        senderId: socket.user?._id,
      });

    } catch (error) {
      console.error("Socket message error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

async function start() {
  try {
    // connect to database
    await connectDB();

    // middleware
    app.use(cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }));
    app.use(express.json());

    // test route
    app.get("/", (req, res) => {
      res.send("Welcome to the Service Booking Platform API");
    });

    // routes
    app.use("/api/user", userRouter);
    app.use("/api/provider", providerRoute);
    app.use("/api/bookings", bookingRouter);
    app.use("/api/messages", messageRouter);
    app.use("/api/chat", chatRouter);
    app.use("/api/admin", adminRouter);
    app.use("/api/reviews", reviewRouter);

    // start the server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Fatal startup error:", err);
    process.exit(1);
  }
}

start();
