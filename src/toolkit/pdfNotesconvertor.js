import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

function HandwrittenNotesConverter() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");
  const [outputPdf, setOutputPdf] = useState(null);

  const OCR_API_KEY = "K84544417988957"; // Replace with your OCR.space API key

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreview(
        <img src={fileUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "300px" }} />
      );
    }
  };

  const handleConvert = async () => {
    if (!file) {
      alert("Please upload a file first!");
      return;
    }

    setStatus("Uploading and processing the file...");

    try {
      // Prepare FormData for the API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("apikey", OCR_API_KEY);
      formData.append("language", "eng");

      // Send the file to OCR.space API
      const response = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.IsErroredOnProcessing) {
        throw new Error(result.ErrorMessage || "Error processing the file");
      }

      const extractedText = result.ParsedResults[0].ParsedText;

      // Generate a new PDF with the extracted text
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const fontSize = 12;

      page.drawText(extractedText, {
        x: 50,
        y: height - 50,
        size: fontSize,
        maxWidth: width - 100,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setOutputPdf(url);

      setStatus("Conversion complete!");
    } catch (error) {
      console.error("Error:", error);
      setStatus("An error occurred during processing.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Handwritten Notes Converter</h1>
      <input type="file" onChange={handleFileChange} accept=".png, .jpg, .jpeg, .pdf" />
      <button onClick={handleConvert}>Convert to PDF</button>
      <p>{status}</p>
      <div>{preview}</div>
      {outputPdf && (
        <div>
          <a href={outputPdf} download="ConvertedNotes.pdf">
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}

export default HandwrittenNotesConverter;
