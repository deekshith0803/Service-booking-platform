import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserDocument } from "../model/User.js";

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

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        // 1️⃣ Check header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token, authorization denied",
            });
        }

        // 2️⃣ Extract token ONLY
        const token = authHeader.split(" ")[1];

        // 3️⃣ Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as DecodedToken;

        // 4️⃣ Get user
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // 5️⃣ Attach user to request
        req.user = user;
        next();
    }


    catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({
            success: false,
            message: "Token is not valid",
        });
    }
};
