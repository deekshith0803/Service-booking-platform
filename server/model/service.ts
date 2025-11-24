import mongoose, { Document, Schema } from "mongoose";

export interface ServiceDocument extends Document {
    _id: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    title: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    availability: boolean;
    staffCount: number;
    toolProvided: boolean;
    service_area: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const serviceSchema = new Schema<ServiceDocument>({
    provider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, default: "" },
    availability: { type: Boolean, default: true },
    staffCount: { type: Number, default: 1 },
    toolProvided: { type: Boolean, default: false },
    service_area: { type: String, required: true },
}, { timestamps: true }
);

const Service = mongoose.model<ServiceDocument>("Service", serviceSchema);

export default Service;