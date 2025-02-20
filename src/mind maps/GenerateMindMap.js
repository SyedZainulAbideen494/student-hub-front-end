import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GenerateMindMap = () => {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const generateMindMap = () => {
        setLoading(true);
        axios.post("http://localhost:8080/api/mindmap/generate", {
            topic: topic,
            token: localStorage.getItem('token')
        }).then(response => {
            setLoading(false);
            navigate(`/mindmap/${response.data.mindMapId}`); // Redirect to the Mind Map page
        }).catch(error => {
            setLoading(false);
            console.error("Error generating mind map:", error);
        });
    };

    return (
        <div>
            <h2>Generate a Mind Map</h2>
            <input
                type="text"
                placeholder="Enter topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
            />
            <button onClick={generateMindMap} disabled={loading}>
                {loading ? "Generating..." : "Generate Mind Map"}
            </button>
        </div>
    );
};

export default GenerateMindMap;
