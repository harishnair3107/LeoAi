import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });


// SEND MESSAGE
router.post("/send", authMiddleware, async (req, res) => {
    try {
        const { message } = req.body;
        console.log("Generating response for:", message);

        const result = await model.generateContent(message);
        const reply = result.response.text();

        console.log("Response generated successfully");
        res.json({ reply });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to generate response", details: error.message });
    }
});


// GET CHAT HISTORY
router.get("/history", authMiddleware, (req, res) => {
    res.json({ history: [] }); // Update this later if you want history persistence without sessions
});


export default router;