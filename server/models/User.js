import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0.00,
  },
});

export const User = mongoose.model("User", userSchema);
