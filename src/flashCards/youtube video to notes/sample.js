import React, { useState } from "react";
import axios from "axios";

function AudioToNotes() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState(""); // New state for the prompt
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    summary: false,
    keyPoints: false,
    insights: false,
    questions: false,
  });

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setSelectedOptions({
      ...selectedOptions,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!file) {
      alert("Please upload an audio file first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("audioFile", file);
    formData.append("prompt", prompt); // Add the prompt to the form data
  
    // Generate dynamic prompts based on selected options
    const selectedPrompts = [];
    if (selectedOptions.summary) selectedPrompts.push("Generate a concise summary of the audio content, highlighting the most important points.");
    if (selectedOptions.keyPoints) selectedPrompts.push("Identify the key points from the audio, emphasizing critical details and essential information.");
    if (selectedOptions.insights) selectedPrompts.push("Provide valuable insights or analysis based on the audio, explaining the context or underlying meaning where applicable.");
    if (selectedOptions.questions) selectedPrompts.push("Generate a list of relevant questions from the audio, focusing on key areas that might require further exploration or discussion.");
    if (selectedOptions.htmlFormat) selectedPrompts.push("Generate the content from the audio in HTML format, using appropriate tags like <p>, <h1>, <h2>, <h3>, <h4>, <ul>, <ol>, <li>, <b>, <i>, and others for formatting. Do not include DOCTYPE, HTML, BODY, or HEAD tags.");
  
    formData.append("selectedPrompts", JSON.stringify(selectedPrompts));
  
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/summarize-audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate notes from the audio.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <h2>Audio Notes Generator</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="audio" style={{ display: "block", marginBottom: "10px" }}>
          Upload Audio:
        </label>
        <input
          type="file"
          accept="audio/*"
          name="audio"
          id="audio"
          onChange={handleFileChange}
          style={{ marginBottom: "20px" }}
        />
        <label htmlFor="prompt" style={{ display: "block", marginBottom: "10px" }}>
          Enter Prompt (optional):
        </label>
        <input
          type="text"
          name="prompt"
          id="prompt"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Please summarize the audio."
          style={{ marginBottom: "20px", display: "block", width: "100%" }}
        />
        
        <div>
          <h3>Select content to generate:</h3>
          <label>
            <input
              type="checkbox"
              name="summary"
              checked={selectedOptions.summary}
              onChange={handleCheckboxChange}
            />
            Summary
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              name="keyPoints"
              checked={selectedOptions.keyPoints}
              onChange={handleCheckboxChange}
            />
            Key Points
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              name="insights"
              checked={selectedOptions.insights}
              onChange={handleCheckboxChange}
            />
            Insights
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              name="questions"
              checked={selectedOptions.questions}
              onChange={handleCheckboxChange}
            />
            Questions
          </label>
        </div>
        <label>
  <input
    type="checkbox"
    name="htmlFormat"
    checked={selectedOptions.htmlFormat}
    onChange={handleCheckboxChange}
  />
  Generate in HTML Format
</label>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Generate Notes"}
        </button>
      </form>

      {summary && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Notes:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default AudioToNotes;
