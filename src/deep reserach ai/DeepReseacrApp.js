import React, { useState } from "react";
import axios from "axios";

const DeepResearchApp = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        setError("");
        setResults([]);

        try {
            const response = await axios.get(`http://localhost:8080/search/ai/research?q=${query}`);
            setResults(response.data);
        } catch (error) {
            console.error("Search error:", error);
            setError("Failed to fetch results. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>🔎 Edusify Research AI</h1>
            <input
                type="text"
                placeholder="Search anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    padding: "10px",
                    width: "60%",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "16px",
                }}
            />
            <button
                onClick={handleSearch}
                style={{
                    padding: "10px 15px",
                    marginLeft: "10px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                }}
            >
                Search
            </button>

            {loading && <p style={{ marginTop: "20px", fontSize: "16px" }}>Loading...</p>}
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

            <ul style={{ textAlign: "left", marginTop: "20px", listStyle: "none", padding: "0" }}>
                {results.map((item, index) => (
                    <li
                        key={index}
                        style={{
                            background: "#f8f8f8",
                            padding: "15px",
                            borderRadius: "8px",
                            marginBottom: "15px",
                            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                        }}
                    >
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                textDecoration: "none",
                                color: "#007bff",
                            }}
                        >
                            {item.title}
                        </a>
                        <p style={{ fontSize: "14px", color: "#555", marginTop: "5px" }}>
                            {item.content}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeepResearchApp;
