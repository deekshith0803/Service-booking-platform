import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
    senderId: any;
    receiverId?: any;
    conversationId?: string;
    bookingId?: string;
    text: string;
    isRead: boolean;
    timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional if using conversationId
    conversationId: { type: String },
    bookingId: { type: String },
    text: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Message", MessageSchema);
