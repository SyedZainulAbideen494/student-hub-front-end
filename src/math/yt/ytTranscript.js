import React, { useState } from "react";
import axios from "axios";
import { API_ROUTES } from "../../app_modules/apiRoutes";

function GetYtApp() {
    const [videoUrl, setVideoUrl] = useState("");
    const [transcript, setTranscript] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchTranscript = async () => {
        if (!videoUrl) return alert("Please enter a YouTube URL!");
        setLoading(true);

        try {
            const response = await axios.post(API_ROUTES.aiYtSummary, { videoUrl });
            setTranscript(response.data.transcript);
        } catch (error) {
            alert("Failed to fetch transcript.");
        }
        
        setLoading(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>YouTube Video Transcript</h2>
            <input
                type="text"
                placeholder="Enter YouTube video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                style={{ width: "300px", padding: "5px", marginRight: "10px" }}
            />
            <button onClick={fetchTranscript} disabled={loading}>
                {loading ? "Fetching..." : "Get Transcript"}
            </button>
            <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
                <h3>Transcript:</h3>
                <p>{transcript || "No transcript yet."}</p>
            </div>
        </div>
    );
}

export default GetYtApp;
