import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./models/User.js";
import { Transaction } from "./models/Transaction.js";
import { Savings } from "./models/SavingsGoal.js";
import { PasswordReset } from "./models/PasswordReset.js";
import nodemailer from "nodemailer";
import { createAccessToken } from "./tokens/CreateAccessToken.js";
import { createRefreshToken } from "./tokens/CreateRefreshToken.js";
import { PendingUser } from "./models/PendingUser.js";
import { emailVerificationTemplate } from "./templates/emailVerificationTemplate.js";
import forgotPasswordTemplate from "./templates/forgotPasswordTemplate.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@fintech.froeigt.mongodb.net/?retryWrites=true&w=majority&appName=FinTech`;

mongoose
  .connect(MONGO_URI, {
    dbName: "fintech",
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/register", async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match!" });
  }
  try {
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).send({ message: "This email already exists" });
    }

    await PendingUser.deleteMany({ email: normalizedEmail });

    const passwordHash = await bcrypt.hash(password, 10);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);

    await PendingUser.create({
      fullname,
      email: normalizedEmail,
      passwordHash,
      codeHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `Spendora Support`,
      to: normalizedEmail,
      subject: "Verify your email for Spendora",
      html: emailVerificationTemplate(fullname, code),
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Verification code sent successfully!" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).send({ message: "Registration failed" });
  }
});

app.post("/verify_email", async (req, res) => {
  const { email, code } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const pending = await PendingUser.findOne({ email: normalizedEmail });
    if (!pending) {
      return res
        .status(400)
        .json({ message: "Verification request not found!" });
    }

    if (pending.expiresAt < new Date()) {
      await PendingUser.deleteMany({ email: normalizedEmail });
      return res.status(400).json({ message: "Verification code expired!" });
    }

    const isMatch = await bcrypt.compare(code, pending.codeHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Code is incorrect" });
    }

    const newUser = new User({
      fullname: pending.fullname,
      email: pending.email,
      password: pending.passwordHash,
      balance: 0,
    });

    await newUser.save();

    await PendingUser.deleteMany({ email: normalizedEmail });

    return res.json({ message: "Email verified!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const normalizedEmail = req.body.email.toLowerCase().trim();
  const { password } = req.body;
  
  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).send({ message: "Login is incorrect!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Password is incorrect!" });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
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

app.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = createAccessToken(user);
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh error: ", error);
    return res.status(403).json({ message: "Invalid refresh token" });
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

app.post("/user/:id/create_goal", async (req, res) => {
  const { id } = req.params;
  const { goalAmount, goalTitle } = req.body;

  if (!goalAmount || !goalTitle) {
    return res
      .status(400)
      .send({ message: "Amount and goal title is required!" });
  }

  try {
    const savingsGoal = new Savings({
      userId: id,
      currentAmount: 0.0,
      amount: goalAmount,
      title: goalTitle,
      date: new Date(),
    });

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).send({ message: "User not found!" });
    }

    await savingsGoal.save();

    res.json({ message: "Savings goal was successfully created!" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).send({ message: "Server error!" });
  }
});

app.get("/user/:id/goals", async (req, res) => {
  const { id } = req.params;

  try {
    const goals = await Savings.find({ userId: id }).sort({ date: -1 });
    res.json({ goals });
  } catch (error) {
    console.error("Error fetching savings goals: ", error);
    res.status(500).send({ message: "Server error!" });
  }
});

app.delete("/user/:id/delete_goal/:goalId", async (req, res) => {
  const { id, goalId } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const goal = await Savings.findOne({ _id: goalId, userId: id });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found!" });
    }

    if (goal.currentAmount > 0.0) {
      user.balance += goal.currentAmount;
      await user.save();
    }

    await goal.deleteOne();
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting goal: ", error);
    res.status(500).json({ message: "Server error!" });
  }
});

app.post("/user/:id/:goalId/top_up", async (req, res) => {
  const { id, goalId } = req.params;

  const { topUpAmount } = req.body;

  if (!topUpAmount || topUpAmount <= 0) {
    return res
      .status(400)
      .json({ message: "Top-up amount must be greater than 0!" });
  }

  try {
    const goal = await Savings.findOne({ _id: goalId, userId: id });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found!" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (goal.currentAmount >= goal.amount) {
      return res.status(400).json({
        message: `Goal ${goal.title} is already completed!`,
        goalCompleted: true,
      });
    }

    const remainingToGoal = goal.amount - goal.currentAmount;
    const actualTopUp = Math.min(topUpAmount, remainingToGoal);
    const returnedAmount =
      topUpAmount > remainingToGoal ? topUpAmount - remainingToGoal : 0;

    if (user.balance < actualTopUp) {
      return res.status(400).json({ message: "Insufficient balance!" });
    }

    user.balance -= actualTopUp;
    if (returnedAmount > 0) {
      user.balance += returnedAmount;
    }

    goal.currentAmount += actualTopUp;
    let goalCompleted = false;

    if (goal.currentAmount >= goal.amount) {
      goal.currentAmount = goal.amount;
      goalCompleted = true;
    }

    await user.save();
    await goal.save();

    res.json({
      message: goalCompleted
        ? `Goal ${goal.title} has been fully funded!`
        : `Added $${actualTopUp.toFixed(2)} to ${goal.title}.`,
      newBalance: user.balance,
      updatedGoal: goal,
      goalCompleted,
    });
  } catch (error) {
    console.error("Top up error: ", error);
    res.status(500).json({ message: "Server error!" });
  }
});

app.post("/forgot-password-send-code", async (req, res) => {
  const email = String(req.body.email || "")
    .toLowerCase()
    .trim();
  if (!email || email === "") {
    return res.status(400).json({ message: "Email is required!" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email address is incorrect!" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await PasswordReset.deleteMany({ email });

    await PasswordReset.create({
      email,
      codeHash,
      expiresAt,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `Spendora Support`,
      to: email,
      subject: `Your Spendora Password Reset Code`,
      html: forgotPasswordTemplate(code),
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ message: "Verification code sent successfully!" });
  } catch (error) {
    console.error("Forgot password send code error:", error);
    return res
      .status(500)
      .json({ message: "Server error. Could not send email." });
  }
});

app.post("/forgot-password-verify-code", async (req, res) => {
  const { email, verificationCode } = req.body;

  const normalizedEmail = String(email || "")
    .toLowerCase()
    .trim();
  const enteredCode = String(verificationCode || "").trim();

  if (!normalizedEmail || normalizedEmail === "") {
    return res.status(400).json({ message: "Email is required!" });
  }
  if (!enteredCode || enteredCode === "") {
    return res.status(400).json({ message: "Verification code is required!" });
  }
  try {
    const record = await PasswordReset.findOne({ email: normalizedEmail }).sort(
      { createdAt: -1 }
    );
    if (!record) {
      return res.status(400).json({ message: "No valid code found." });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Code has expired." });
    }

    const isMatch = await bcrypt.compare(enteredCode, record.codeHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Code is incorrect" });
    }

    record.verified = true;
    await record.save();
    return res.status(200).json({ message: "Code verified successfully!" });
  } catch (error) {
    console.error("Error verifying code:", error);
    return res
      .status(500)
      .json({ message: "Server error. Could not verify code." });
  }
});

app.post("/reset-password", async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  const normalizedEmail = String(email || "")
    .toLowerCase()
    .trim();

  if (!newPassword) {
    return res.status(400).json({ message: "Please enter the new password" });
  }

  if (!confirmNewPassword) {
    return res.status(400).json({ message: "Please confirm the new password" });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  try {
    const record = await PasswordReset.findOne({ email: normalizedEmail }).sort(
      { createdAt: -1 }
    );
    if (!record || !record.verified) {
      return res.status(400).json({ message: "Code not verified" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "User is not found." });
    }

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({
        message: "New password must be different from the previous one.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    await PasswordReset.deleteMany({ email: normalizedEmail });
    return res.status(200).json({ message: "Password successfully updated!" });
  } catch (error) {
    console.error("Error resetting password: ", error);
    return res.status(500).json({ message: "Server error!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
