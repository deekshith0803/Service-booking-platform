import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../model/User.js";
import generateToken from "../utils/generateToken.js";
import { AuthenticatedRequest } from "../types/auth.js"
import Service from "../model/Service.js";

// REGISTER
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.json({ success: false, message: "Invalid input" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET LOGGED-IN USER
export const getUserData = async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, user: req.user });
};

// SERVICES
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const filter: Record<string, any> = {
      availability: true,
    };

    if (category) {
      filter.category = new RegExp(`^${category}$`, "i");
    }

    const services = await Service.find(filter);

    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};


