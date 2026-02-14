import express from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OTP from "../models/OTP.js";

const router = express.Router();

// Transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// SEND OTP
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.json({ error: "Email is required" });

    try {
        const code = Math.floor(1000 + Math.random() * 9000).toString();

        // Save or update OTP in DB
        await OTP.findOneAndUpdate(
            { email },
            { email, code, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your LeoAi Verification Code',
            text: `Your 4-digit verification code is: ${code}. It will expire in 5 minutes.`
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${email}`);
        res.json({ message: "OTP sent to email" });

    } catch (error) {
        console.error("OTP Error Details:", error);
        res.status(500).json({ error: "Failed to send OTP. If you are using Gmail, please ensure you use an App Password in your .env file." });
    }
});

// REGISTER
router.post("/register", async (req, res) => {
    const { name, email, password, otp } = req.body;

    // Verify OTP first
    const otpDoc = await OTP.findOne({ email, code: otp });
    if (!otpDoc) return res.json({ error: "Invalid or expired OTP" });

    const exists = await User.findOne({ email });
    if (exists) return res.json({ error: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    // Delete OTP after successful registration
    await OTP.deleteOne({ _id: otpDoc._id });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: "Registered", user, token });
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "User not found" });

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) return res.json({ error: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: "Logged in", user, token });
});

// LOGOUT
router.post("/logout", (req, res) => {
    res.json({ message: "Logged out" });
});

export default router;