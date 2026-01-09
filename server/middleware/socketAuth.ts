import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

interface DecodedToken extends jwt.JwtPayload {
    id: string;
}

// Extend Socket interface to include user
declare module "socket.io" {
    interface Socket {
        user?: any;
    }
}

export const socketAuthMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as DecodedToken;

        // Get user
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return next(new Error("Authentication error: User not found"));
        }

        // Attach user to socket
        socket.user = user;
        next();
    } catch (err) {
        next(new Error("Authentication error: Invalid token"));
    }
};
