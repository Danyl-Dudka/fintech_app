import mongoose from "mongoose";

const savingsGoalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  currentAmount: {
    type: Number,
    default: 0.0,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const Savings = mongoose.model("Savings", savingsGoalSchema);
