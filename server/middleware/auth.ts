import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserDocument } from "../model/User.js";

// Extend Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: UserDocument | null;
        }
    }
}
interface DecodedToken extends JwtPayload {
    id: string;
  }


export const protect = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }
    try {
        const userId = jwt.verify(token, process.env.JWT_SECRET as string);

        console.log(userId);

        if (!userId) {
            return res.status(401).json({ success: false, message: "Token is not valid" });
        }
        req.user = await User.findById(userId).select("-password");
        next();
    } catch (error) {
        console.error("Something wrong with auth middleware");
        res.status(500).json({ success: false, message: "Server Error" });
    }
} 