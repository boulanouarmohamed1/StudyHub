require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

const askGeminiStream = async (text, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const result = await model.generateContent(`Please explain this content:\n\n${message}`);
    const response = await result.response;
    const text = response.text();
  
    const words = text.split(" ");
    for (const word of words) {
      res.write(`data: ${word}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
  
    res.write("event: done\ndata: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Gemini Error:", error);
    res.write("event: error\ndata: Gemini failed\n\n");
    res.end();
  } }

module.exports = askGeminiStream;
