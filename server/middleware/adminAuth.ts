import { Request, Response, NextFunction } from "express";

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.email === "deekshithm321@gmail.com") {
        next();
    } else {
        res.status(403).json({ success: false, message: "Not authorized as admin" });
    }
};
