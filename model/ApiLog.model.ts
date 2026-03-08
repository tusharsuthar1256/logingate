import mongoose, { Schema, Document } from 'mongoose';

export interface IApiLog extends Document {
    userId: string;
    endpoint: string;
    method: string;
    requestPayload: any;
    responsePayload: any;
    statusCode: number;
    durationMs: number;
    verdict: string;
    riskScore: number;
    threatType: string;
    createdAt: Date;
}

const ApiLogSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    endpoint: { type: String, required: true },
    method: { type: String, default: 'POST' },
    requestPayload: { type: Schema.Types.Mixed },
    responsePayload: { type: Schema.Types.Mixed },
    statusCode: { type: Number, required: true },
    durationMs: { type: Number, required: true },
    verdict: { type: String, default: 'allow' },
    riskScore: { type: Number, default: 0 },
    threatType: { type: String, default: 'none' },
    createdAt: { type: Date, default: Date.now, index: true }
});

const ApiLog = mongoose.models.ApiLog || mongoose.model<IApiLog>('ApiLog', ApiLogSchema);

export default ApiLog;
