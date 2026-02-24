import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

// HACKATHON PRO-TIP: Always have a "Mock Mode" fallback so your demo never breaks!
const MOCK_ANSWERS = {
    "hi": "Hello! I am your EDUBUILD STEM Assistant. I'm currently running in 'Lab Simulation Mode'. How can I help you build something today? 🚀",
    "hello": "Hello! I am your EDUBUILD STEM Assistant. I'm currently running in 'Lab Simulation Mode'. How can I help you build something today? 🚀",
    "default": "That's a great scientific question! As a STEM assistant, I recommend exploring our 'Project Tools' on the left to find a specific experiment for your class level. Building hands-on projects is the best way to learn! 🔬✨",
    "explain": "This project works on the principles of energy conversion! By using simple materials like cardboard and plastic, we can demonstrate how potential energy becomes kinetic energy. It's like magic, but with science! 🪄"
};

const getMockReply = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes("hi") || msg.includes("hello")) return MOCK_ANSWERS.hi;
    if (msg.includes("how") || msg.includes("what") || msg.includes("why")) return MOCK_ANSWERS.default;
    return "I'm here to help you with your STEM projects! Try asking about gravity, electricity, or how to build a volcano. 🌋";
};

export const explainProject = async (req, res) => {
    try {
        const { title, description, materials, language = 'english' } = req.body;

        // Try Gemini if key exists
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = `Explain this STEM project simply in ${language}: ${title}. Description: ${description}. Materials: ${materials.join(', ')}. Use 3 bullet points.`;
                const result = await model.generateContent(prompt);
                return res.json({ explanation: result.response.text() });
            } catch (err) {
                console.warn("Gemini Error, falling back to Mock:", err.message);
            }
        }

        // Fallback for Hackathon Demo
        res.json({
            explanation: `🔬 **Lab Simulation Mode**\n\n1. 🧐 **What is this?**\nA hands-on science experiment called "${title}".\n\n2. 🔭 **The Science**\nIt demonstrates basic physics/chemistry principles using everyday materials.\n\n3. 💡 **Pro-Tip**\nMake sure your ${materials[0] || 'materials'} are clean and ready before starting!`
        });

    } catch (error) {
        res.status(500).json({ explanation: "I'm currently observing a chemical reaction! Please try again in a moment. 🧪" });
    }
};

export const chatWithAI = async (req, res) => {
    try {
        const { message, language = 'english' } = req.body;

        // Try Gemini if key exists
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                // Using 1.5-flash as it's the most widely available free tier model now
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `You are a friendly STEM assistant for the EDUBUILD project. 
                Keep answers short, encouraging, and use emojis. 
                Respond in ${language}.
                User: ${message}`;

                const result = await model.generateContent(prompt);
                return res.json({ reply: result.response.text() });
            } catch (err) {
                console.warn("Gemini API Failure:", err.message);
                // If it's a 404 for the model, try gemini-pro as a last resort
                if (err.message.includes("404")) {
                    try {
                        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                        const result = await model.generateContent(prompt);
                        return res.json({ reply: result.response.text() });
                    } catch (e2) { }
                }
            }
        }

        // Smart Fallback for Demo
        res.json({ reply: getMockReply(message) });

    } catch (error) {
        res.json({ reply: "I'm a bit busy in the science lab! Let's talk about projects instead. 🧪✨" });
    }
};
