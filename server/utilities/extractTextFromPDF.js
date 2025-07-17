// extractTextFromPDF.js
const pdfParse = require("pdf-parse");
const fs = require("fs");
const pdf = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    if (!data.text || data.text.trim().length === 0) {
      console.error("❌ PDF parsing returned empty text.");
      return null;
    }

    return data.text.trim(); // Cleaned text
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return null;
  }
};

module.exports = extractTextFromPDF;
