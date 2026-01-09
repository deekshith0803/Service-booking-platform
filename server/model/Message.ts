import mongoose, { Document, Schema, Types } from "mongoose";

export interface MessageDocument extends Document {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    text: string;
    createdAt: Date;
}

const messageSchema = new Schema<MessageDocument>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Message = mongoose.model<MessageDocument>("Message", messageSchema);

export default Message;
