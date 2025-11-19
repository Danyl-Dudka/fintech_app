import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    passwordHash: String,
    codeHash: String,
    expiresAt: Date
}, { timestamps: true });

export const PendingUser = mongoose.model("PendingUser", pendingUserSchema);