import mongoose, { Schema, Document } from 'mongoose';

export interface IDomainList extends Document {
    userId: string;
    domain: string;
    listType: 'whitelist' | 'blacklist';
    createdAt: Date;
}

const DomainListSchema: Schema = new Schema({
    userId: { type: String, required: true },
    domain: { type: String, required: true },
    listType: { type: String, required: true, enum: ['whitelist', 'blacklist'] },
    createdAt: { type: Date, default: Date.now }
});

// Ensure a user cannot add the same domain multiple times to the same list
DomainListSchema.index({ userId: 1, domain: 1, listType: 1 }, { unique: true });

const DomainList = mongoose.models.DomainList || mongoose.model<IDomainList>('DomainList', DomainListSchema);

export default DomainList;
