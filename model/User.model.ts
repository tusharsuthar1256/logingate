import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    clerkId: { type: String, unique: true, sparse: true },
    password: String, // hashed
    webhookUrl: String,
    webhookEnabled: { type: Boolean, default: false },
    webhookSecret: String,
    customDomains: [String],
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model("User", userSchema);
