import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./models/User.js";
import { Transaction } from "./models/Transaction.js";
import OpenAI from "openai";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
app.use(express.json());
app.use(cors());

const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@fintech.froeigt.mongodb.net/?retryWrites=true&w=majority&appName=FinTech`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const incomeSummary =
      Number(summary.find((s) => s._id === "income")?.total.toFixed(2)) || 0;
    const expenseSummary =
      Number(summary.find((s) => s._id === "expense")?.total.toFixed(2)) || 0;

    return res.json({ incomeSummary, expenseSummary });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Server error!" });
  }
});

app.post("/user/:id/money_control", async (req, res) => {
  const { id } = req.params;
  const { amount, description, category, type } = req.body;

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
      type: type,
    });

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).send({ message: "User not found!" });
    }

    if (type === "income") {
      user.balance = (user.balance || 0) + amount;
    } else if (type === "expense") {
      user.balance = (user.balance || 0) - amount;
    }

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
          type: { $in: ["income", "expense"] },
          date: { $gte: startDate, $lt: endDate },
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

    const incomesAmountByCategory = summaryByCategory.filter(
      (s) => s.type === "income"
    );
    const expensesAmountByCategory = summaryByCategory.filter(
      (s) => s.type === "expense"
    );

    res.status(200).json({ incomesAmountByCategory, expensesAmountByCategory });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/user/:id/transactions", async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;
  try {
    const filter = { userId: id };
    if (type === "income" || type === "expense") {
      filter.type = type;
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).send({ message: "Server error!" });
  }
});

app.post("/user/:id/ai_query", async (req, res) => {
  const { id } = req.params;
  const { query } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ answer: "User not found" });

    const transactions = await Transaction.find({ userId: id })
      .sort({ date: -1 })
      .limit(10);

    const prompt = `
User info:
- Current balance: $${user.balance.toFixed(2)}
- Last transactions: ${transactions
      .map((t) => `${t.type} $${t.amount} (${t.category})`)
      .join("; ")}

Question: ${query}
Answer ONLY with the number of the current balance:
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
    });

    const answer = response.choices[0].message.content.trim();
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ answer: "AI server error" });
  }
});

app.post("/user/:id/ai_popular_category", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ answer: "User not found" });

    const dateNow = new Date();
    const startDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1);
    const endDate = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 1);

    const transactions = await Transaction.find({
      userId: id,
      date: { $gte: startDate, $lt: endDate },
    });

    if (transactions.length === 0) {
      return res.json({
        popularCategory: null,
        total: 0,
        aiAnswer: "No transactions this month",
      });
    }

    const categoryTotals = {};
    transactions.forEach((t) => {
      if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
      categoryTotals[t.category] += t.amount;
    });

    let popularCategory = "None";
    let total = 0;
    for (const [category, amount] of Object.entries(categoryTotals)) {
      if (amount > total) {
        popularCategory = category;
        total = amount;
      }
    }

    const prompt = `
User info:
- Current balance: $${user.balance.toFixed(2)}
- Last transactions: ${transactions
      .map((t) => `${t.type} $${t.amount} (${t.category})`)
      .join("; ")}

Question: What is my most popular category this month?
Answer with the category name and total spent.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
    });

    const aiAnswer = response.choices[0].message.content.trim();

    res.json({
      popularCategory,
      total,
      aiAnswer,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ popularCategory: null, total: 0, aiAnswer: "AI server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http:localhost:${PORT}`);
});
