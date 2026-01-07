import { Request, Response } from "express";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Service from "../model/Service.js";

//generate token
const generateToken = (userId: string) => {
  const payload = userId;
  return jwt.sign(payload, process.env.JWT_SECRET as string);
}

//register user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.json({ success: false, message: "All fields are required and password must be at least 8 characters long" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const checkEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!checkEmail) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id.toString());
    return res.json({ success: true, message: "User registered successfully", token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

//login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());
    return res.json({ success: true, message: "User logged in successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

//get user data using token (JWT)
export const getUserData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // convert mongoose document to plain object if needed
    const userObj = typeof (user as any).toObject === "function" ? (user as any).toObject() : { ...user };

    // remove sensitive / potentially circular data
    delete userObj.password;
    // pick only safe fields to return
    const safeUser = {
      _id: userObj._id,
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
      image: userObj.image,
      // add other allowed fields explicitly
    };

    return res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error("getUserData error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//get all services
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ availability: true });
    res.json({ success: true, services });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error });
  }
}