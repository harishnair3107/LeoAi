import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
sender: { type: String, enum: ["user", "ai"], required: true },
text: { type: String, required: true },
timestamp: { type: Date, default: Date.now }
});


const chatSessionSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
title: { type: String, default: "New Chat" },
messages: [messageSchema],
createdAt: { type: Date, default: Date.now }
});


export default mongoose.model("ChatSession", chatSessionSchema);