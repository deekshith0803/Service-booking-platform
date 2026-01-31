import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../model/User.js";
import generateToken from "../utils/generateToken.js";
import { AuthenticatedRequest } from "../types/auth.js"
import Service from "../model/Service.js";
import crypto from "crypto";
import sendResetPasswordEmail from "../utils/emailUtils.js";

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

    if (!user.password) return res.json({ success: false, message: "Invalid credentials (use Google Login)" });

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

    const services = await Service.find(filter).populate("provider", "name email image");

    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};


// GOOGLE LOGIN
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;
    const { OAuth2Client } = await import("google-auth-library");
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, message: "Invalid Google Token" });
    }

    const { email, name, sub: googleId, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // If user exists, update googleId if missing
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name: name || "Google User",
        email,
        googleId,
        image: picture,
        role: "user", // Default role
      });
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image
      },
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ success: false, message: "Google Login Failed" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    // Generate Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    try {
      await sendResetPasswordEmail(user.email, resetToken);
      res.json({ success: true, message: "Reset link sent to your email" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.error("Email send error:", error);
      res.status(500).json({ success: false, message: "Failed to send email" });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
