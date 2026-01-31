import express from "express";
import { getAllServices, getUserData, loginUser, registerUser, googleLogin, forgotPassword, resetPassword } from "../controller/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/data", protect, getUserData)
userRouter.get("/services", getAllServices)
userRouter.post("/google-login", googleLogin);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;