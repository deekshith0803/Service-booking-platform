import mongoose, { Document, Schema, Types } from "mongoose";

export interface ConversationDocument extends Document {
    userId: Types.ObjectId;
    providerId: Types.ObjectId;
    serviceId: Types.ObjectId;
    lastMessage: string;
    updatedAt: Date;
}

const conversationSchema = new Schema<ConversationDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        providerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        lastMessage: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Ensure unique conversation per user-provider-service trio
conversationSchema.index({ userId: 1, providerId: 1, serviceId: 1 }, { unique: true });

const Conversation = mongoose.model<ConversationDocument>("Conversation", conversationSchema);

export default Conversation;
