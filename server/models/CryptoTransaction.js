import mongoose from "mongoose";

const cryptoTransactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  cryptoAmount: {
    type: Number,
    required: true,
  },
  tradeType: {
    type: String,
    enum: ["long", "short"],
    required: true,
  },
  pairName: {
    type: String,
    required: true,
  },
  entryPrice: {
    type: Number,
    required: true,
  },
  exitPrice: {
    type: Number,
    required: true,
  },
  leverage: {
    type: Number,
    required: true,
  },
  tradeResult: {
    type: Number,
    required: true,
  },
});

export const CryptoTransaction = mongoose.model(
  "CryptoTransaction",
  cryptoTransactionSchema
);
