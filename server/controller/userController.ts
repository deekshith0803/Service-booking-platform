import { Request, Response } from "express";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    console.log(error);
    return res.json({ success: false, message: error });
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
    console.log(error);
    return res.json({ success: false, message: error });
  }
};
