import ChatSession from "../models/ChatSession.js";
import axios from "axios";


export const createSession = async (req, res) => {
const session = await ChatSession.create({ userId: req.user.id });
res.json(session);
};


export const getSessions = async (req, res) => {
const sessions = await ChatSession.find({ userId: req.user.id });
res.json(sessions);
};


export const sendMessage = async (req, res) => {
const { sessionId, message } = req.body;


let session = await ChatSession.findById(sessionId);


// Save user message
session.messages.push({ sender: "user", text: message });
await session.save();


// Call Gemini API
const response = await axios.post(
`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GENAI_API_KEY}`,
{
contents: [{ parts: [{ text: message }] }],
}
);


const aiText = response.data.candidates[0].content.parts[0].text;


// Save AI message
session.messages.push({ sender: "ai", text: aiText });
await session.save();


res.json({ reply: aiText, session });
};