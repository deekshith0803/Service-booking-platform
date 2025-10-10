import mongoose, { Document, Types } from "mongoose";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "user" | "provider";
  image?: string;
}

const userSchema = new mongoose.Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "provider"], default: "user" },
  image: { type: String, default: "" },
});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
