import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./models/User.js";
import { Transaction } from "./models/Transaction.js";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
app.use(express.json());
app.use(cors());

const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@fintech.froeigt.mongodb.net/?retryWrites=true&w=majority&appName=FinTech`;

mongoose
  .connect(MONGO_URI, {
    dbName: "fintech",
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/register", async (req, res) => {
  const { fullname, login, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match!" });
  }
  try {
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(400).send({ message: "This login already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      login,
      password: hashedPassword,
      balance: 0.0,
    });
    await newUser.save();
    res.json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).send({ message: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(400).send({ message: "Login is incorrect!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Password is incorrect!" });
    }

    const token = jwt.sign(
      { userId: user._id, fullname: user.fullname },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      userId: user._id,
      fullname: user.fullname,
      balance: Number(user.balance.toFixed(2)),
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/user/:id/balance", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).send({ message: "User not found!" });
    }
    res.json({ balance: user.balance });
  } catch (error) {
    return res.status(500).send({ message: "Server error" });
  }
});

app.get("/user/:id/current_month_summary", async (req, res) => {
  const { id } = req.params;
  try {
    const dateNow = new Date();
    const startDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1);
    const endDate = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 1);

    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: id,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$type",
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const incomeSummary = summary.find((s) => s._id === "income")?.total || 0;
    const expenseSummary = summary.find((s) => s._id === "expense")?.total || 0;

    return res.json({ incomeSummary, expenseSummary });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Server error!" });
  }
});

app.post("/user/:id/income", async (req, res) => {
  const { id } = req.params;
  const { amount, description, category } = req.body;

  if (!amount) {
    return res.status(400).send({ message: "Amount is required!" });
  }

  try {
    const newTransaction = new Transaction({
      userId: id,
      amount,
      description: description || "No description",
      category: category || "No category",
      date: new Date(),
      type: "income",
    });

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).send({ message: "User not found!" });
    }

    user.balance = (user.balance || 0) + amount;

    await user.save();
    await newTransaction.save();

    res.json({
      message: "New transaction was successfully created!",
      newBalance: user.balance,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Server error!" });
  }
});

app.post("/user/:id/expense", async (req, res) => {
  const { id } = req.params;
  const { amount, description, category } = req.body;

  if (!amount) {
    return res.status(400).send({ message: "Amount is required!" });
  }
  try {
    const newTransaction = new Transaction({
      userId: id,
      amount,
      description: description || "No description",
      category: category || "No category",
      date: new Date(),
      type: "expense",
    });

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).send({ message: "User not found!" });
    }

    user.balance = (user.balance || 0) - amount;

    await user.save();
    await newTransaction.save();

    res.json({
      message: "New transaction was successfully created!",
      newBalance: user.balance,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Server error!" });
  }
});

app.get("/user/:id/amount_by_category", async (req, res) => {
  const { id } = req.params;
  const dateNow = new Date();
  const startDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1);
  const endDate = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 1);

  try {
    const summaryByCategory = await Transaction.aggregate([
      {
        $match: {
          userId: id,
          date: { $gte: startDate, $lt: endDate },
          type: { $in: ["income", "expense"] },
        },
      },
      {
        $group: {
          _id: { type: "$type", category: "$category" },
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          type: "$_id.type",
          category: "$_id.category",
          amount: "$total",
        },
      },
    ]);

    const incomesAmountByCategory = summaryByCategory.filter((s) => s.type === 'income');
    const expensesAmountByCategory = summaryByCategory.filter((s) => s.type === 'expense');

    res.status(200).json({ incomesAmountByCategory, expensesAmountByCategory });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http:localhost:${PORT}`);
});
