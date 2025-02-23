import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";
import "./MindMapHistory.css"; // Add CSS for styling

const MindMapHistory = () => {
  const [mindMaps, setMindMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMindMaps = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(API_ROUTES.getMindMaps, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMindMaps(response.data);
      } catch (error) {
        console.error("Error fetching mind maps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMindMaps();
  }, []);

  return (
    <div className="mindmap-history-container">
      <h1>My Mind Maps</h1>

      {loading ? (
        <p>Loading...</p>
      ) : mindMaps.length === 0 ? (
        <p>No mind maps created yet.</p>
      ) : (
        <ul className="mindmap-list">
          {mindMaps.map((mindmap) => (
            <li 
              key={mindmap.id} 
              className="mindmap-item" 
              onClick={() => navigate(`/mindmap/${mindmap.id}`)}
            >
              <h2>{mindmap.name}</h2>
              <p><strong>Subject:</strong> {mindmap.subject}</p>
              <p><strong>Created on:</strong> {new Date(mindmap.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MindMapHistory;
