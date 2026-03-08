import mongoose, { Schema, models } from "mongoose";

const webhookLogSchema = new Schema(
    {
        userId: String,
        url: String,
        event: String, // e.g., 'fraud.detected'
        payload: Object,
        responseStatus: Number,
        responseBody: String,
        status: { type: String, enum: ['success', 'failed'], default: 'success' },
    },
    { timestamps: true }
);

export const WebhookLog = models.WebhookLog || mongoose.model("WebhookLog", webhookLogSchema);
