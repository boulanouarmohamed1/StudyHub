const askGemini = require("../gemini");

async function chatWithGemini(req, res) {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const reply = await askGemini(message);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Gemini failed" });
  }
}

module.exports = { chatWithGemini };
