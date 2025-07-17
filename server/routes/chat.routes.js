const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Function to bold titles and math-related content (variables x, y, z, numbers, LaTeX)
function boldTitlesAndMath(text) {
  // First, handle Markdown headings (e.g., # Heading, ## Subheading)
  text = text.replace(/^(#{1,6}\s+)(.*?)$/gm, (match, prefix, title) => {
    return `${prefix}**${title.trim()}**`;
  });

  // Then, handle math-related content: numbers, variables (x, y, z), and LaTeX
  text = text.replace(
    /\b(\d+\/\d+|\d+\.\d+|[-\d+|[xXyYzZ]\b|\$[^\$]+\$)/g,
    (match) => {
      // If it's a LaTeX expression (starts and ends with $)
      if (match.startsWith('$') && match.endsWith('$')) {
        // Bold numbers and variables x, y, z inside LaTeX
        return match.replace(
          /(\d+\/\d+|\d+\.\d+|[-\d+|[xXyYzZ])/g,
          '**$1**'
        );
      }
      // Bold numbers (fractions, decimals, integers) and variables x, y, z
      return `**${match}**`;
    }
  );

  // Handle superscripts (e.g., x², y³) separately to bold only the variable
  text = text.replace(/\b([xXyYzZ])([\^][0-9]+)/g, '**$1**$2');
  
  return text;
}

router.get("/chat", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const message = req.query.message;

  try {
    const result = await model.generateContent(`Please explain this content:\n\n${message}`);
    const response = await result.response;
    let text = response.text();

    // Apply bold formatting to titles and math content
    text = boldTitlesAndMath(text);

    const words = text.split(" ");
    for (const word of words) {
      res.write(`data: ${word}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }

    res.write("event: done\ndata: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("SSE Error:", err);
    res.write("event: error\ndata: Gemini failed\n\n");
    res.end();
  }
});

router.post("/upload-pdf", upload.single("file"), async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(fileBuffer);
    fs.unlinkSync(req.file.path); // delete file after reading

    const prompt = `The user uploaded the following document. Respond intelligently:\n\n${data.text.slice(0, 8000)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Apply bold formatting to titles and math content
    text = boldTitlesAndMath(text);

    const words = text.split(" ");
    for (const word of words) {
      res.write(`data: ${word}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }

    res.write("event: done\ndata: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error(err);
    res.write("event: error\ndata: Failed to process PDF\n\n");
    res.end();
  }
});

module.exports = router;