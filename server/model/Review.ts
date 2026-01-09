import mongoose, { Document, Schema } from "mongoose";

export interface ReviewDocument extends Document {
    serviceId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new Schema<ReviewDocument>(
    {
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Review = mongoose.model<ReviewDocument>("Review", reviewSchema);
export default Review;
