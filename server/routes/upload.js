const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const extractTextFromPDF = require("../utilities/extractTextFromPDF.js");
const extractTextFromPDFWithOCR = require("../ocr.js");
const askGemini = require("../gemini");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/pdf", upload.single("pdf"), async (req, res) => {
  try {
    const filePath = path.join(__dirname, "..", req.file.path);

    // 1. Try fast method (pdf-parse)
  let text = await extractTextFromPDF(filePath)
console.log("📄 Extracted with pdf-parse:\n", text)

if (!text || text.length < 20) {
  console.warn("⚠️ PDF-Parse returned too little, using OCR...")
  text = await extractTextFromPDFWithOCR(filePath)
}


    // 3. If still nothing, respond with error
    if (!text || text.trim().length < 10) {
      fs.unlinkSync(filePath);
      return res.json({ explanation: "⚠️ PDF is empty or unreadable." });
    }

    // 4. Ask Gemini to explain
    const explanation = await askGemini(text);
    fs.unlinkSync(filePath); // Clean up

    res.json({ explanation });
  } catch (err) {
    console.error("Error in /pdf route:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
