import mongoose, { Document, Schema } from "mongoose";

export interface BookingDocument extends Document {
    service: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    date: Date;
    time: string;
    price: number;
    status: string;
    paymentId?: string;
    orderId?: string;
    paymentStatus: string;
    notes?: string;
    address: string;
    phone: string;
    paymentMethod: "cod" | "online";
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<BookingDocument>(
    {
        service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        provider: { type: Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        price: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },
        paymentId: { type: String },
        orderId: { type: String },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        notes: { type: String, default: "" },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        paymentMethod: { type: String, enum: ["cod", "online"], default: "online" }
    },
    { timestamps: true }
);

const Booking = mongoose.model<BookingDocument>("Booking", bookingSchema);

export default Booking;