import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // import navigation hook
import "./LectureRecorder.css";
import { FaMicrophone, FaStop, FaFileAlt } from "react-icons/fa";
import FooterNav from "../app_modules/footernav";
import { API_ROUTES } from "../app_modules/apiRoutes";

export default function LectureRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [summary, setSummary] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false); // to track upload status
  const mediaRecorderRef = useRef(null);
  const [hoverStart, setHoverStart] = useState(false);
  const [hoverStop, setHoverStop] = useState(false);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) =>
      audioChunksRef.current.push(e.data);

    mediaRecorderRef.current.start();
    setRecording(true);
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = async () => {
    // stop media recorder and wait for data to be available
    return new Promise((resolve) => {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        setAudioBlob(audioBlob);
        clearInterval(timerRef.current);
        setRecording(false);
        resolve(audioBlob);
      };
      mediaRecorderRef.current.stop();
    });
  };

  const handleStopAndUpload = async () => {
    try {
      setLoading(true);
      navigate("/loading/mock-exam"); // 👉 Go to loading screen before processing
  
      const recordedBlob = await stopRecording();
      if (!recordedBlob) throw new Error("No audio recorded.");
  
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("audio", recordedBlob, "lecture.mp3");
      formData.append("prompt", `
     You are an expert academic tutor and note-taking assistant specializing in converting lecture audio content into detailed, well-organized HTML notes designed for effective study and quick revision.

Instructions:

- Listen attentively to the lecture audio.
- Create structured notes using valid HTML markup only.
- Use semantic headings to organize content:
  - <h1> for main lecture title or major topics,
  - <h2> for primary subtopics,
  - <h3> for detailed sub-subtopics.
- Present key information in bullet lists (<ul><li>):
  - Important points,
  - Definitions,
  - Formulas.
- Highlight critical concepts, exam tips, and key terms with <b> (bold) or <i> (italic) tags for emphasis.
- Incorporate mathematical formulas in appropriate inline math notation (e.g., LaTeX style inside <math> or as inline text if MathML is not supported).
- Exclude filler content, personal remarks, greetings, or irrelevant information.
- Keep notes concise yet thorough, focusing on clarity and ease of revision.
- Output must be a clean, valid, and well-formed HTML snippet ONLY — no markdown, plain text, code blocks, or extraneous elements.

Generate the lecture notes exactly as described, formatted and ready to be displayed in an HTML viewer or study app.

        `); // keep full prompt as you have it
  
      const res = await fetch(API_ROUTES.generateNotesFromAudio, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await res.json();
      if (!data.flashcardId) throw new Error("No flashcard ID received.");
  
      // Redirect to the generated notes view
      navigate(`/note/view/${data.flashcardId}`);
    } catch (error) {
      console.error("Error uploading or generating notes:", error);
      alert("Failed to generate notes. Please try again.");
      navigate("/record"); // optionally return to recording page
    } finally {
      setLoading(false);
    }
  };
  

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };


  
  return (
    <div className="container__ai__audio__recorder">
      <h1 className="title__ai__audio__recorder">
        <svg
          height="24"
          width="24"
          fill="#5a94ff"
          viewBox="0 0 24 24"
          className="icon__ai__audio__recorder"
        >
          <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
        </svg>
        AI Audio Recorder
      </h1>

      <p className="desc__ai__audio__recorder">
        Record your thoughts, lectures, or ideas and let AI turn them into smart, beautifully crafted notes.
      </p>

      {!recording ? (
          <div className="button-group__ai__audio__recorder" style={{ display: "flex", gap: "12px" }}>
          <button
            className="button__ai__audio__recorder primary-btn__ai__audio__recorder"
            onClick={startRecording}
            disabled={loading}
          >
            <FaMicrophone />
            Start Recording
          </button>
    
          <button
            className="button__ai__audio__recorder secondary-btn__ai__audio__recorder"
            onClick={() => {
         navigate("/audio-notes");
            }}
            disabled={loading}
          >
            View Previous Recordings
          </button>
        </div>
      ) : (
        <div className="recording-box__ai__audio__recorder">
          <div className="timer__ai__audio__recorder">
            <FaStop />
            <span>Recording {formatTime(timer)}</span>
          </div>
          <button
            className="button__ai__audio__recorder stop-btn__ai__audio__recorder"
            onClick={handleStopAndUpload}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaFileAlt />
                Summarizing...
              </>
            ) : (
              <>
                <FaStop />
                Stop & Save
              </>
            )}
          </button>
        </div>
      )}

      {summary && (
        <div className="summary-box__ai__audio__recorder">
          <h2 className="summary-title__ai__audio__recorder">
            <FaFileAlt style={{ marginRight: 8 }} />
            AI Summary
          </h2>
          <div dangerouslySetInnerHTML={{ __html: summary }} />
        </div>
      )}
      {!recording && <FooterNav />}

    </div>
);
}