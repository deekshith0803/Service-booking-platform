import { Request } from "express";
import { UserDocument } from "../model/User.js";

export interface AuthenticatedRequest extends Request {
    user?: UserDocument | null;
}
