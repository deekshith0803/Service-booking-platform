import mongoose, { Document, Schema } from "mongoose";

export interface ServiceDocument extends Document {
    provider: mongoose.Types.ObjectId;
    title: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    availability: boolean;
    staffCount: number; // default capacity if not in dailyCapacity
    dailyCapacity: {
        monday: number;
        tuesday: number;
        wednesday: number;
        thursday: number;
        friday: number;
        saturday: number;
        sunday: number;
    };
    service_area: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const serviceSchema = new Schema<ServiceDocument>(
    {
        provider: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            default: "",
        },

        availability: {
            type: Boolean,
            default: true,
        },

        dailyCapacity: {
            monday: { type: Number, default: 1 },
            tuesday: { type: Number, default: 1 },
            wednesday: { type: Number, default: 1 },
            thursday: { type: Number, default: 1 },
            friday: { type: Number, default: 1 },
            saturday: { type: Number, default: 1 },
            sunday: { type: Number, default: 1 },
        },
        service_area: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Service = mongoose.model<ServiceDocument>("Service", serviceSchema);
export default Service;
