require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "frontend")));

// ===============================
// GEMINI AI CONFIGURATION
// ===============================

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash"
});

// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ===============================
// CHAT ROUTE
// ===============================

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        // Check if message exists
        if (!message || message.trim() === "") {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        console.log("User message:", message);

        // Send message to Gemini
        const result = await model.generateContent(message);

        const response = result.response;
        const reply = response.text();

        console.log("Gemini response generated successfully");

        res.json({
            reply: reply
        });

    } catch (error) {
        console.error("Gemini API Error:", error);

        res.status(500).json({
            error: "Failed to generate response",
            details: error.message
        });
    }
});

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});