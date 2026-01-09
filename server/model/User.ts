import mongoose, { Document, Types } from "mongoose";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: "user" | "provider";
  image?: string;
  isApproved: boolean;
  isProviderRequested: boolean;
}

const userSchema = new mongoose.Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  role: { type: String, enum: ["user", "provider"], default: "user" },
  image: { type: String, default: "" },
  isApproved: { type: Boolean, default: false },
  isProviderRequested: { type: Boolean, default: false },
});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
