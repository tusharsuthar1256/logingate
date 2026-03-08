import mongoose, { Schema, models } from "mongoose";

const apiKeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: "Default API Key"
    },
    status: {
        type: String,
        enum: ["active", "revoked"],
        default: "active"
    },
    lastUsedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export const ApiKey = mongoose.models.ApiKey || mongoose.model("ApiKey", apiKeySchema);
